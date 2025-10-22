import { computed, Injectable, signal } from '@angular/core';
import { AccidentsService } from '../../services/accidents.service';
import { Accident } from '../../models/accident';
import { FilterStore } from '../filter/filter.store';
import { AccidentsStoreFiltersEnum } from './types';

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

  constructor(private filterStore: FilterStore) {}

  setAccidents(accidents: Accident[]): void {
    this._accidents.set(accidents);
  }

  setDefaultAccidents(accidents: Accident[]): void {
    this._defaultAccidents.set(accidents);
  }

  setLoading(loading: boolean): void {
    this._loading.set(loading);
  }

  setError(error: string | null): void {
    this._error.set(error);
  }

  applyFilters(name: AccidentsStoreFiltersEnum): void {
    const filters = this.filterStore.filters();
    const allAccidents = this._defaultAccidents();
    let filteredAccidents = [...allAccidents];

    if (
      name === AccidentsStoreFiltersEnum.Categories &&
      filters.categories &&
      filters.categories.length > 0
    ) {
      filteredAccidents = filteredAccidents.filter((accident) =>
        filters.categories!.includes(accident.category)
      );
    }

    if (name === AccidentsStoreFiltersEnum.SeverityRange) {
      const [min, max] = filters.severityRange;
      filteredAccidents = filteredAccidents.filter(
        (accident) => accident.severity >= min && accident.severity <= max
      );
    }

    if (
      name === AccidentsStoreFiltersEnum.DataRange &&
      (filters.dataRange[0] || filters.dataRange[1])
    ) {
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
