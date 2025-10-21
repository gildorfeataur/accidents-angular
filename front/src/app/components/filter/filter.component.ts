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
import { AccidentsStoreFiltersEnum } from '../../stores/accidents/types';

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

    effect(() => {
      const filterStore = this.filterStore.filters();
      // Оновлюємо форму при зміні store
      this.filterForm.patchValue(
        {
          categories: filterStore.categories || [],
          severityMin: filterStore.severityRange[0],
          severityMax: filterStore.severityRange[1],
          dateFrom: filterStore.dataRange[0],
          dateTo: filterStore.dataRange[1],
        },
        { emitEvent: false }
      );
    });
    // Підписуємося на зміни полів
    this.fieldChangeListeners();
  }

  private fieldChangeListeners(): void {
    // Категорія
    this.filterForm.get(FilterFormFieldsEnum.Categories)?.valueChanges.subscribe((value) => {
      this.filterStore.setCategory(value || []);
      this.accidentsStore.applyFilters(AccidentsStoreFiltersEnum.Categories);
    });

    // Мінімальний рівень
    this.filterForm.get(FilterFormFieldsEnum.SeverityMin)?.valueChanges.subscribe((value) => {
      const defaultMaxValue = this.filterForm.get(FilterFormFieldsEnum.SeverityMax)?.value;
      this.filterStore.setSeverityRange([value, defaultMaxValue]);
      this.accidentsStore.applyFilters(AccidentsStoreFiltersEnum.SeverityRange);
    });

    // Максимальний рівень
    this.filterForm.get(FilterFormFieldsEnum.SeverityMax)?.valueChanges.subscribe((value) => {
      const defaultMinValue = this.filterForm.get(FilterFormFieldsEnum.SeverityMin)?.value;
      this.filterStore.setSeverityRange([defaultMinValue, value]);
      this.accidentsStore.applyFilters(AccidentsStoreFiltersEnum.SeverityRange);
    });

    // Дата початок
    this.filterForm.get(FilterFormFieldsEnum.DateFrom)?.valueChanges.subscribe((value) => {
      const currentDateTo = this.filterForm.get(FilterFormFieldsEnum.DateTo)?.value;
      this.filterStore.setDataRange([value, currentDateTo]);
      this.accidentsStore.applyFilters(AccidentsStoreFiltersEnum.DataRange);
    });

    // Дата кінець
    this.filterForm.get(FilterFormFieldsEnum.DateTo)?.valueChanges.subscribe((value) => {
      const currentDateFrom = this.filterForm.get(FilterFormFieldsEnum.DateFrom)?.value;
      this.filterStore.setDataRange([currentDateFrom, value]);
      this.accidentsStore.applyFilters(AccidentsStoreFiltersEnum.DataRange);
    });
  }

  protected onResetHandler(): void {
    this.filterStore.reset();
    this.accidentsStore.setAccidents(this.accidentsStore.defaultAccidents());
  }
}
