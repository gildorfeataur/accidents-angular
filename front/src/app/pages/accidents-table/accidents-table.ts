import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccidentsService, Accident } from '../../services/accidents.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-accidents',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './accidents-table.html',
  styleUrl: './accidents-table.scss',
})
export class AccidentsTablePage implements OnInit {
  private accidentsService = inject(AccidentsService);

  accidents: Accident[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.loadAccidents();
  }

  loadAccidents(): void {
    this.loading = true;
    this.error = null;

    this.accidentsService.getAccidents().subscribe({
      next: (data) => {
        this.accidents = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Помилка завантаження даних про аварії';
        this.loading = false;
        console.error('Error loading accidents:', err);
      },
    });
  }
}
