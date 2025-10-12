import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccidentsService, Accident } from '../../services/accidents.service';
import { RouterLink } from '@angular/router';
import { Navigation } from '../../components/navigation/navigation';

@Component({
  selector: 'app-accidents',
  standalone: true,
  providers: [AccidentsService],
  imports: [CommonModule, RouterLink, Navigation],
  templateUrl: './accidents-table.html',
  styleUrl: './accidents-table.scss',
})
export class AccidentsTablePage implements OnInit {
  constructor(private accidentsService: AccidentsService) {}

  protected accidents: Accident[] = [];
  protected accidentPageElements: Accident[] = [];
  protected loading: boolean = true;
  protected error: string | null = null;
  protected page: number = 1;
  protected limit: number = 10;

  protected get totalPages(): number {
    return Math.ceil(this.accidents.length / this.limit);
  }

  ngOnInit(): void {
    this.loadAccidents();
  }

  private loadAccidents(): void {
    this.loading = true;
    this.error = null;

    this.accidentsService.getAccidents().subscribe({
      next: (data) => {
        this.accidents = data;
        this.accidentPageElements = this.accidents.slice(0, this.limit * this.page);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Помилка завантаження даних про аварії';
        this.loading = false;
        console.error('Error loading accidents:', err);
      },
    });
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
