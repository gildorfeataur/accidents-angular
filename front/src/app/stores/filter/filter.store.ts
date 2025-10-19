import { Injectable, signal, computed } from '@angular/core';
import { FilterStoreProps } from './types';
import { defaultFilterStoreValues } from './constants';

@Injectable({ providedIn: 'root' })
export class FilterStore {
  private _filters = defaultFilterStoreValues;

  // 🔸 Селектори (computed)
  filters = computed(() => this._filters());
  activeCategory = computed(() => this._filters().category);
  severityRange = computed(() => this._filters().severityRange);
  dataRange = computed(() => this._filters().dataRange);

  // 🔸 Методи оновлення стану
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
    this._filters.set(defaultFilterStoreValues());
  }
}
