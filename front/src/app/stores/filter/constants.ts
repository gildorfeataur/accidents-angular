import { signal } from '@angular/core';
import { FilterStoreProps } from './types';

export const defaultFilterStoreValues: FilterStoreProps = {
  categories: [],
  severityRange: [1, 5],
  dataRange: [null, null],
};
