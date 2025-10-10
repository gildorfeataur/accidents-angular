import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Accident, AccidentsService } from '../../services/accidents.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-accident',
  templateUrl: './accident.html',
  styleUrl: './accident.scss',
  imports: [RouterLink, DatePipe],
})
export class AccidentPage {
  private accidentsService = inject(AccidentsService);
  private accidentId: string | null = null;
  protected accident: Accident | null = null;
  protected loading = true;
  protected error: string | null = null;

  ngOnInit(): void {
    const urlParts = window.location.pathname.split('/');
    this.accidentId = urlParts[2];
    this.loadAccident();
  }

  loadAccident(): void {
    if (!this.accidentId) {
      this.error = 'Invalid accident ID';
      this.loading = false;
      return;
    }
    this.loading = true;
    this.error = null;

    this.accidentsService.getAccidentById(this.accidentId).subscribe({
      next: (data) => {
        this.accident = data;
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
