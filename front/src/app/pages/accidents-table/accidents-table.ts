import { Component, effect, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccidentsService } from '../../services/accidents.service';
import { RouterLink } from '@angular/router';
import { Navigation } from '../../components/navigation/navigation';
import { FilterComponent } from '../../components/filter/filter.component';
import { Accident } from '../../models/accident';
import { AccidentsStore } from '../../stores/accidents/accidents.store';

@Component({
  selector: 'app-accidents',
  standalone: true,
  providers: [AccidentsService],
  imports: [CommonModule, RouterLink, Navigation, FilterComponent],
  templateUrl: './accidents-table.html',
  styleUrl: './accidents-table.scss',
})
export class AccidentsTablePage implements OnInit {
  protected accidents: Accident[] = [];
  protected accidentPageElements: Accident[] = [];
  protected page: number = 1;
  protected limit: number = 10;
  protected get totalPages(): number {
    return Math.ceil(this.accidents.length / this.limit);
  }

  constructor(protected accidentsStore: AccidentsStore) {
    effect(() => {
      this.accidents = this.accidentsStore.accidents();
      this.accidentPageElements = this.accidents.slice(0, this.limit * this.page);
    });
  }

  ngOnInit(): void {
    this.accidentsStore.getAccidents();
  }

  protected nextPage(): void {
    if (this.page * this.limit < this.accidents.length) {
      this.accidentPageElements = this.accidents.slice(
        (this.page + 1) * this.limit - this.limit,
        (this.page + 1) * this.limit
      );
      this.page++;
    }
  }

  protected previousPage(): void {
    if (this.page > 1) {
      this.accidentPageElements = this.accidents.slice(
        (this.page - 1) * this.limit - this.limit,
        (this.page - 1) * this.limit
      );
      this.page--;
    }
  }
}
