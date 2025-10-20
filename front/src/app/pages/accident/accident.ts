import { DatePipe, Location } from '@angular/common';
import { Component, effect, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AccidentsService } from '../../services/accidents.service';
import { Subscription } from 'rxjs';
import { Accident } from '../../models/accident';
import { AccidentsStore } from '../../stores/accidents/accidents.store';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-accident',
  templateUrl: './accident.html',
  styleUrl: './accident.scss',
  standalone: true,
  providers: [AccidentsService],
  imports: [RouterLink, DatePipe, MatProgressSpinner],
})
export class AccidentPage implements OnInit, OnDestroy {
  private accidentId: string | null = null;
  protected subscription: Subscription | null = null;
  protected accident: Accident | null = null;
  protected loading = true;
  protected error: string | null = null;

  constructor(
    private accidentsStore: AccidentsStore,
    private accidentsService: AccidentsService,
    private route: ActivatedRoute,
    private location: Location
  ) {
    effect(() => {
      const accidents = this.accidentsStore.accidents();
      if (this.accidentId && accidents.length > 0) {
        const foundAccident = accidents.find((accident) => accident.id === this.accidentId);
        if (foundAccident) {
          this.accident = foundAccident;
          this.loading = false;
          this.error = null;
        }
      }
    });
  }

  ngOnInit(): void {
    this.subscription = this.route.params.subscribe((params) => {
      this.accidentId = params['id'];
      this.loadAccident();
    });
  }

  loadAccident(): void {
    const accidents = this.accidentsStore.accidents();
    this.loading = true;
    this.error = null;

    if (!this.accidentId) {
      this.error = 'Invalid accident ID';
      this.loading = false;
      return;
    }

    if (accidents.length > 0) {
      const foundAccident = accidents.find((accident) => accident.id === this.accidentId);
      if (foundAccident) {
        this.accident = foundAccident;
        this.loading = false;
        return;
      }
    }

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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  goBack(): void {
    this.location.back();
  }
}
