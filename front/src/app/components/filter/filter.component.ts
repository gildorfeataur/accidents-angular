import { Component, effect, EventEmitter, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { FilterStore } from '../../stores/filter/filter.store';
import { FilterFormProps } from './filter.types';
import { defaultCategoriesList } from './filter.constants';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatSliderModule,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    MatButtonModule,
    MatCardModule,
  ],
})
export class FilterComponent {
  @Output() filterChange = new EventEmitter<FilterFormProps>();

  protected filterForm!: FormGroup;
  protected categoriesList = defaultCategoriesList;

  constructor(public filterStore: FilterStore) {
    this.filterForm = new FormGroup({
      categories: new FormControl<string[]>(this.filterStore.filters().categories || []),
      severityMin: new FormControl(this.filterStore.filters().severityRange[0] || 1),
      severityMax: new FormControl(this.filterStore.filters().severityRange[1] || 5),
      dateFrom: new FormControl<Date | null>(this.filterStore.filters().dataRange[0] || null),
      dateTo: new FormControl<Date | null>(this.filterStore.filters().dataRange[1] || null),
    });

    // Синхронізація форми зі store
    effect(() => {
      const filters = this.filterStore.filters();

      // Оновлюємо форму при зміні store
      this.filterForm.patchValue(
        {
          categories: filters.categories || [],
          severityMin: filters.severityRange[0],
          severityMax: filters.severityRange[1],
          dateFrom: filters.dataRange[0],
          dateTo: filters.dataRange[1],
        },
        { emitEvent: false }
      );
    });

    // Підписуємося на зміни форми
    this.filterForm.valueChanges.subscribe(() => {
      this.emitFilterChange();
    });
  }

  private emitFilterChange(): void {
    const formValue = this.filterForm.value;
    this.filterStore.setCategory(formValue.categories ? formValue.categories : []);
    this.filterStore.setSeverityRange([formValue.severityMin || 1, formValue.severityMax || 5]);
    this.filterStore.setDataRange([formValue.dateFrom || null, formValue.dateTo || null]);
  }

  protected onReset(): void {
    this.filterStore.reset();
  }
}
