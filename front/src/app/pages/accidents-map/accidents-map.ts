import { AfterViewInit, Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { Accident, AccidentsService } from '../../services/accidents.service';

@Component({
  selector: 'app-accidents-map',
  templateUrl: './accidents-map.html',
  styleUrls: ['./accidents-map.scss'],
  providers: [AccidentsService],
  standalone: true,
})
export class AccidentsMapPage implements OnInit, AfterViewInit {
  private accidents: Accident[] = [];
  private map!: L.Map;
  private markers: L.Marker[] = [L.marker([50.45266465079895, 30.519056941565243])];
  protected loading = true;
  protected error: string | null = null;

  private accidentPopup(accident: Accident): string {
    // Accident popup content
    return `
      <div class="accident-details">
        <p><strong>Status:</strong> ${accident.status || 'N/A'}</p>
        <p><strong>Coordinates:</strong> ${accident.lat || 'N/A'}, ${accident.lng || 'N/A'}</p>
        <p><strong>Time:</strong> ${accident.timestamp || 'N/A'}</p>
      </div>
    `;
  }

  constructor(private accidentsService: AccidentsService) {}

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
          .bindPopup(() => this.accidentPopup(accident));
      }
    });

    // Центруємо карту по всім маркерам
    // this.centerMapToAccidents();
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
