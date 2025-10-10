import { AfterViewInit, Component, inject, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Accident, AccidentsService } from '../../services/accidents.service';

@Component({
  selector: 'app-accidents-map',
  templateUrl: './accidents-map.html',
  styleUrls: ['./accidents-map.scss'],
  standalone: true,
})
export class AccidentsMapPage implements OnInit, AfterViewInit {
  private accidentsService = inject(AccidentsService);
  accidents: Accident[] = [];
  loading = true;
  error: string | null = null;
  private map!: L.Map;
  markers: L.Marker[] = [
    L.marker([50.45266465079895, 30.519056941565243]), // Kyiv, Ukraine
  ];

  constructor() {}

  ngOnInit() {
    this.loadAccidents();
  }

  ngAfterViewInit() {
    this.initMap();
    this.centerMap();
  }

  private loadAccidents(): void {
    this.loading = true;
    this.error = null;

    this.accidentsService.getAccidents().subscribe({
      next: (data) => {
        this.accidents = data;
        this.loading = false;
        // Додаємо маркери після завантаження даних
        this.addAccidentMarkers();
      },
      error: (err) => {
        this.error = 'Помилка завантаження даних про аварії';
        this.loading = false;
        console.error('Error loading accidents:', err);
      },
    });
  }

  private initMap() {
    const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    this.map = L.map('map');
    L.tileLayer(baseMapURl).addTo(this.map);
  }

  private addAccidentMarkers(): void {
    // Перевіряємо, чи карта вже ініціалізована
    if (!this.map) return;

    // Очищуємо попередні маркери аварій (залишаємо тільки статичні)
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker && !this.markers.includes(layer)) {
        this.map.removeLayer(layer);
      }
    });

    // Додаємо маркери для кожної аварії
    this.accidents.forEach((accident) => {
      if (accident.lat && accident.lng) {
        L.marker([accident.lat, accident.lng])
          .addTo(this.map)
          .bindPopup(
            `<div class="accident-details">
            <p><strong>Статус:</strong> ${accident.status}</p>
            <p><strong>Координати:</strong> ${accident.lat}, ${accident.lng}</p>
            <p><strong>Час:</strong> ${new Date(accident.timestamp).toLocaleString()}</p>
          </div>`
          );
      }
    });

    // Центруємо карту по всім маркерам
    this.centerMapToAccidents();
  }

  private centerMap() {
    // Create a boundary based on the markers
    const bounds = L.latLngBounds(this.markers.map((marker) => marker.getLatLng()));
    // Fit the map into the boundary
    this.map.fitBounds(bounds);
  }

  private centerMapToAccidents() {
    if (this.accidents.length === 0) {
      // Якщо немає аварій, центруємо по статичним маркерам
      this.centerMap();
      return;
    }

    // Створюємо границі на основі координат аварій
    const accidentCoords = this.accidents
      .filter((accident) => accident.lat && accident.lng)
      .map((accident) => [accident.lat, accident.lng] as [number, number]);

    if (accidentCoords.length > 0) {
      const bounds = L.latLngBounds(accidentCoords);
      this.map.fitBounds(bounds, { padding: [10, 10] });
    } else {
      // Якщо координати аварій недоступні, центруємо по статичним маркерам
      this.centerMap();
    }
  }
}
