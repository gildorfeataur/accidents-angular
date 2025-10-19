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
import { FilterFormFieldsEnum, FilterFormProps } from './filter.types';
import { defaultCategoriesList, defaultSeverityLevels } from './filter.constants';
import { AccidentsStore } from '../../stores/accidents/accidents.store';

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
  protected severityLevels = defaultSeverityLevels;

  constructor(public filterStore: FilterStore, private accidentsStore: AccidentsStore) {
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

    // Підписуємося на зміни окремих полів форми
    this.fieldChangeListeners();
  }

  private fieldChangeListeners(): void {
    this.filterForm.get(FilterFormFieldsEnum.Categories)?.valueChanges.subscribe((value) => {
      this.fieldChangeHandler(FilterFormFieldsEnum.Categories, value);
    });

    this.filterForm.get(FilterFormFieldsEnum.SeverityMin)?.valueChanges.subscribe((value) => {
      this.fieldChangeHandler(FilterFormFieldsEnum.SeverityMin, value);
    });

    this.filterForm.get(FilterFormFieldsEnum.SeverityMax)?.valueChanges.subscribe((value) => {
      this.fieldChangeHandler(FilterFormFieldsEnum.SeverityMax, value);
    });

    this.filterForm.get(FilterFormFieldsEnum.DateFrom)?.valueChanges.subscribe((value) => {
      this.fieldChangeHandler(FilterFormFieldsEnum.DateFrom, value);
    });

    this.filterForm.get(FilterFormFieldsEnum.DateTo)?.valueChanges.subscribe((value) => {
      this.fieldChangeHandler(FilterFormFieldsEnum.DateTo, value);
    });
  }

  private fieldChangeHandler(fieldName: FilterFormFieldsEnum, value: any): void {
    console.log(`Поле "${fieldName}" змінилось на:`, value);

    // Оновлюємо відповідне значення в store залежно від поля
    switch (fieldName) {
      case FilterFormFieldsEnum.Categories:
        this.filterStore.setCategory(value || []);
        break;

      case FilterFormFieldsEnum.SeverityMin:
      case FilterFormFieldsEnum.SeverityMax:
        const currentMin = this.filterForm.get(FilterFormFieldsEnum.SeverityMin)?.value || 1;
        const currentMax = this.filterForm.get(FilterFormFieldsEnum.SeverityMax)?.value || 5;
        this.filterStore.setSeverityRange([currentMin, currentMax]);
        break;

      case FilterFormFieldsEnum.DateFrom:
      case FilterFormFieldsEnum.DateTo:
        const currentDateFrom = this.filterForm.get(FilterFormFieldsEnum.DateFrom)?.value || null;
        const currentDateTo = this.filterForm.get(FilterFormFieldsEnum.DateTo)?.value || null;
        this.filterStore.setDataRange([currentDateFrom, currentDateTo]);
        break;
    }

    // Застосовуємо фільтри до аварій
    this.accidentsStore.applyFilters();
  }

  protected onReset(): void {
    this.filterStore.reset();
    // Скидаємо фільтри і показуємо всі аварії
    this.accidentsStore.applyFilters();
  }
}
