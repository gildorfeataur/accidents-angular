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
import { FilterStore } from '../../stores/filter.store';

export interface FilterData {
  categories: string[];
  severityRange: [number, number];
  dateFrom: Date | null;
  dateTo: Date | null;
}

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
  @Output() filterChange = new EventEmitter<FilterData>();

  categories = [
    { value: 'bus', label: 'Автобус' },
    { value: 'tram', label: 'Трамвай' },
    { value: 'metro', label: 'Метро' },
  ];

  protected filterForm = new FormGroup({
    categories: new FormControl<string[]>([]),
    severityMin: new FormControl(1),
    severityMax: new FormControl(5),
    dateFrom: new FormControl<Date | null>(null),
    dateTo: new FormControl<Date | null>(null),
  });

  constructor(public filterStore: FilterStore) {
    effect(() => {
      console.log('Filters changed:', this.filterStore.filters());
    });
    // Підписуємося на зміни форми
    this.filterForm.valueChanges.subscribe(() => {
      this.emitFilterChange();
    });
  }

  private emitFilterChange(): void {
    const formValue = this.filterForm.value;
    console.log(formValue.categories);
    this.filterStore.setCategory(
      formValue.categories && formValue.categories.length > 0 ? formValue.categories[0] : null
    );

    const filterData: FilterData = {
      categories: formValue.categories || [],
      severityRange: [formValue.severityMin || 1, formValue.severityMax || 5],
      dateFrom: formValue.dateFrom || null,
      dateTo: formValue.dateTo || null,
    };
    this.filterChange.emit(filterData);
  }

  onReset(): void {
    this.filterForm.reset({
      categories: [],
      severityMin: 1,
      severityMax: 5,
      dateFrom: null,
      dateTo: null,
    });
  }
}
