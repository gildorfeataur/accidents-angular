import { Injectable, signal, computed } from '@angular/core';
import { defaultFilterStoreValues } from './constants';
import { FilterStoreProps } from './types';

@Injectable({ providedIn: 'root' })
export class FilterStore {
  private _filters = signal<FilterStoreProps>(defaultFilterStoreValues);

  filters = computed(() => this._filters());
  activeCategory = computed(() => this._filters().category);
  severityRange = computed(() => this._filters().severityRange);
  dataRange = computed(() => this._filters().dataRange);

  setCategory(category: string[] | null) {
    this._filters.update((f) => ({ ...f, category }));
  }

  setSeverityRange(severityRange: [number, number]) {
    this._filters.update((f) => ({ ...f, severityRange }));
  }

  setDataRange(dataRange: [Date | null, Date | null]) {
    this._filters.update((f) => ({ ...f, dataRange }));
  }

  reset() {
    this._filters.set(defaultFilterStoreValues);
  }
}
