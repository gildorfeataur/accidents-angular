import { computed, Injectable, signal } from '@angular/core';
import { AccidentsService } from '../../services/accidents.service';
import { Accident } from '../../models/accident';
import { FilterStore } from '../filter/filter.store';

@Injectable({
  providedIn: 'root',
})
export class AccidentsStore {
  private _defaultAccidents = signal<Accident[]>([]); // Оригінальні дані з API
  private _accidents = signal<Accident[]>([]); // Відфільтровані дані
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  accidents = computed(() => this._accidents());
  defaultAccidents = computed(() => this._defaultAccidents());
  loading = computed(() => this._loading());
  error = computed(() => this._error());

  constructor(private accidentsService: AccidentsService, private filterStore: FilterStore) {}

  getAccidents(): void {
    this._loading.set(true);
    this._error.set(null);
    this.accidentsService.getAccidents().subscribe({
      next: (data) => {
        this._defaultAccidents.set(data);
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

  applyFilters(): void {
    const filters = this.filterStore.filters();
    const allAccidents = this._defaultAccidents();

    let filteredAccidents = [...allAccidents];

    // Фільтр по категоріях
    if (filters.categories && filters.categories.length > 0) {
      filteredAccidents = filteredAccidents.filter((accident) =>
        filters.categories!.includes(accident.category)
      );
    }

    // Фільтр по рівню складності
    if (filters.severityRange) {
      const [min, max] = filters.severityRange;
      filteredAccidents = filteredAccidents.filter(
        (accident) => accident.severity >= min && accident.severity <= max
      );
    }

    // Фільтр по даті
    if (filters.dataRange && (filters.dataRange[0] || filters.dataRange[1])) {
      const [dateFrom, dateTo] = filters.dataRange;

      filteredAccidents = filteredAccidents.filter((accident) => {
        const accidentDate = new Date(accident.createdAt);

        if (dateFrom && dateTo) {
          return accidentDate >= dateFrom && accidentDate <= dateTo;
        } else if (dateFrom) {
          return accidentDate >= dateFrom;
        } else if (dateTo) {
          return accidentDate <= dateTo;
        }

        return true;
      });
    }

    this.setAccidents(filteredAccidents);
  }
}
