import { computed, Injectable, signal } from '@angular/core';
import { AccidentsService } from '../../services/accidents.service';
import { Accident } from '../../models/accident';
import { FilterStore } from '../filter/filter.store';

@Injectable({
  providedIn: 'root',
})
export class AccidentsStore {
  private _allAccidents = signal<Accident[]>([]); // Оригінальні дані з API
  private _accidents = signal<Accident[]>([]); // Відфільтровані дані
  private _loading = signal(false);
  private _error = signal<string | null>(null);

  accidents = computed(() => this._accidents());
  allAccidents = computed(() => this._allAccidents());
  loading = computed(() => this._loading());
  error = computed(() => this._error());

  constructor(private accidentsService: AccidentsService, private filterStore: FilterStore) {}

  getAccidents(): void {
    this._loading.set(true);
    this._error.set(null);
    this.accidentsService.getAccidents().subscribe({
      next: (data) => {
        this._allAccidents.set(data); // Зберігаємо оригінальні дані
        this._accidents.set(data); // Спочатку показуємо всі дані
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

  /**
   * Застосовує поточні фільтри до всіх аварій
   */
  applyFilters(): void {
    const filters = this.filterStore.filters();
    const allAccidents = this._allAccidents();

    let filtered = [...allAccidents];

    // Фільтр по категоріях
    if (filters.categories && filters.categories.length > 0) {
      filtered = filtered.filter((accident) => filters.categories!.includes(accident.category));
    }

    // Фільтр по рівню серйозності
    if (filters.severityRange) {
      const [min, max] = filters.severityRange;
      filtered = filtered.filter(
        (accident) => accident.severity >= min && accident.severity <= max
      );
    }

    // Фільтр по даті
    if (filters.dataRange && (filters.dataRange[0] || filters.dataRange[1])) {
      const [dateFrom, dateTo] = filters.dataRange;

      filtered = filtered.filter((accident) => {
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

    this.setAccidents(filtered);
  }
}
