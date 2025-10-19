// src/app/stores/filter.store.ts
import { Injectable, signal, computed } from '@angular/core';

export interface Filters {
  search: string;
  category: string | null;
  sort: 'asc' | 'desc';
}

@Injectable({ providedIn: 'root' }) // глобальний скоуп
export class FilterStore {
  // 🔸 Початковий стан
  private _filters = signal<Filters>({
    search: '',
    category: null,
    sort: 'asc',
  });

  // 🔸 Селектори (computed)
  filters = computed(() => this._filters());
  activeCategory = computed(() => this._filters().category);
  searchTerm = computed(() => this._filters().search);

  // 🔸 Методи оновлення стану
  setSearch(term: string) {
    this._filters.update((f) => ({ ...f, search: term }));
  }

  setCategory(category: string | null) {
    this._filters.update((f) => ({ ...f, category }));
  }

  setSort(sort: 'asc' | 'desc') {
    this._filters.update((f) => ({ ...f, sort }));
  }

  reset() {
    this._filters.set({ search: '', category: null, sort: 'asc' });
  }
}
