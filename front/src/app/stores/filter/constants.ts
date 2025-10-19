import { signal } from '@angular/core';
import { FilterStoreProps } from './types';

export const defaultFilterStoreValues: FilterStoreProps = {
  category: [],
  severityRange: [1, 5],
  dataRange: [null, null],
};
