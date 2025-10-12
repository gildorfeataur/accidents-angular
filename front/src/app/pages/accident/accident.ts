import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Accident, AccidentsService } from '../../services/accidents.service';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-accident',
  templateUrl: './accident.html',
  styleUrl: './accident.scss',
  standalone: true,
  providers: [AccidentsService],
  imports: [RouterLink, DatePipe],
})
export class AccidentPage {
  private accidentId: string | null = null;
  protected subscription: Subscription;
  protected accident: Accident | null = null;
  protected loading = true;
  protected error: string | null = null;

  constructor(private accidentsService: AccidentsService, private route: ActivatedRoute) {
    this.subscription = this.route.params.subscribe((params) => {
      this.accidentId = params['id'];
    });
  }

  ngOnInit(): void {
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
