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

  constructor(
    protected accidentsStore: AccidentsStore,
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
          this.accidentsStore.setLoading(false);
          this.accidentsStore.setError(null);
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
    this.accidentsStore.setLoading(true);

    if (!this.accidentId) {
      this.accidentsStore.setError('Invalid accident ID');
      this.accidentsStore.setLoading(false);
      return;
    }

    if (accidents.length > 0) {
      const foundAccident = accidents.find((accident) => accident.id === this.accidentId);
      if (foundAccident) {
        this.accident = foundAccident;
        this.accidentsStore.setLoading(false);
        return;
      }
    }

    this.accidentsService.getAccidentById(this.accidentId).subscribe({
      next: (data) => {
        this.accident = data;
        this.accidentsStore.setLoading(false);
      },
      error: (err) => {
        this.accidentsStore.setError('Помилка завантаження даних про аварії');
        this.accidentsStore.setLoading(false);
        console.error('Error loading accident:', err);
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
