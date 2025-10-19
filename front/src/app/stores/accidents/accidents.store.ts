import { computed, Injectable, signal } from '@angular/core';
import { AccidentsService } from '../../services/accidents.service';
import { Accident } from '../../models/accident';

@Injectable({
  providedIn: 'root',
})
export class AccidentsStore {
  private _accidents = signal<Accident[]>([]);
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  accidents = computed(() => this._accidents());
  loading = computed(() => this._loading());
  error = computed(() => this._error());

  constructor(private accidentsService: AccidentsService) {}

  getAccidents(): void {
    this._loading.set(true);
    this._error.set(null);
    this.accidentsService.getAccidents().subscribe({
      next: (data) => {
        this._accidents.set(data);
        this._loading.set(false);
      },
      error: (err) => {
        this._loading.set(false);
        this._error.set('Помилка завантаження даних про аварії');
        console.error('Error loading accidents:', err);
      },
    });
  }

  setAccidents(accidents: Accident[]): void {
    this._accidents.set(accidents);
  }
}
