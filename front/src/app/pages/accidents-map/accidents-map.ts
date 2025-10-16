import {
  Component,
  OnInit,
  createComponent,
  EnvironmentInjector,
  OnDestroy,
  ComponentRef,
} from '@angular/core';
import * as L from 'leaflet';
import { Accident, AccidentsService } from '../../services/accidents.service';
import { Navigation } from '../../components/navigation/navigation';
import { AccidentPopup } from './components/accident-popup/accident-popup.component';

@Component({
  selector: 'app-accidents-map',
  templateUrl: './accidents-map.html',
  styleUrls: ['./accidents-map.scss'],
  providers: [AccidentsService],
  standalone: true,
  imports: [Navigation],
})
export class AccidentsMapPage implements OnInit, OnDestroy {
  private accidents: Accident[] = [];
  private map!: L.Map;
  private markers: L.Marker[] = [];
  private popupComponents: ComponentRef<AccidentPopup>[] = [];

  protected loading = true;
  protected error: string | null = null;

  constructor(
    private accidentsService: AccidentsService,
    private environmentInjector: EnvironmentInjector
  ) {}

  ngOnInit(): void {
    this.loadAccidents();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  ngOnDestroy(): void {
    this.popupComponents.forEach((ref) => ref.destroy());
    this.popupComponents = [];
    this.map?.remove();
  }

  private loadAccidents(): void {
    this.loading = true;
    this.error = null;

    this.accidentsService.getAccidents().subscribe({
      next: (data) => {
        this.accidents = data;
        this.loading = false;
        if (this.map) {
          this.addAccidentMarkers();
        }
      },
      error: (err) => {
        this.error = 'Помилка завантаження даних про аварії';
        this.loading = false;
        console.error('Error loading accidents:', err);
      },
    });
  }

  private initMap(): void {
    const baseMapURl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    this.map = L.map('map');
    L.tileLayer(baseMapURl, {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    if (this.accidents.length > 0) {
      this.addAccidentMarkers();
    }
  }

  private createAccidentPopup(accident: Accident): HTMLElement {
    const componentRef = createComponent(AccidentPopup, {
      environmentInjector: this.environmentInjector,
    });

    this.popupComponents.push(componentRef);

    componentRef.setInput('id', accident.id || '');
    componentRef.setInput('title', accident.title || '');
    componentRef.setInput('category', accident.category || 'N/A');
    componentRef.setInput('severity', accident.severity || 'N/A');
    componentRef.setInput('lat', accident.lat || 0);
    componentRef.setInput('lng', accident.lng || 0);
    componentRef.setInput('createdAt', new Date(accident.createdAt).toLocaleString());
    componentRef.changeDetectorRef.detectChanges();

    return componentRef.location.nativeElement;
  }

  private addAccidentMarkers(): void {
    if (!this.map) return;

    const icon = L.icon({
      iconUrl: 'assets/marker-icon.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -40],
      shadowSize: [41, 41],
    });

    // Очищуємо попередні маркери аварій
    this.map.eachLayer((layer) => {
      if (layer instanceof L.Marker && !this.markers.includes(layer)) {
        this.map.removeLayer(layer);
      }
    });

    // Додаємо маркери для кожної аварії
    this.accidents.forEach((accident) => {
      if (accident.lat && accident.lng) {
        L.marker([accident.lat, accident.lng], { icon })
          .addTo(this.map)
          .bindPopup(() => this.createAccidentPopup(accident));
      }
    });

    this.centerMapToAccidents();
  }

  private centerMap(): void {
    const bounds = L.latLngBounds(this.markers.map((marker) => marker.getLatLng()));
    this.map.fitBounds(bounds);
  }

  private centerMapToAccidents(): void {
    if (!this.map) return;

    if (this.accidents.length === 0) {
      this.centerMap();
      return;
    }

    const accidentCoords = this.accidents
      .filter((accident) => accident.lat && accident.lng)
      .map((accident) => [accident.lat, accident.lng] as [number, number]);

    if (accidentCoords.length > 0) {
      const bounds = L.latLngBounds(accidentCoords);
      this.map.fitBounds(bounds, { padding: [10, 10] });
    } else {
      this.centerMap();
    }
  }
}
