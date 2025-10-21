import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccidentsStore } from './stores/accidents/accidents.store';
import { AccidentsService } from './services/accidents.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterOutlet],
})
export class App {
  constructor(private accidentsStore: AccidentsStore, private accidentsService: AccidentsService) {}

  ngOnInit(): void {
    this.getAccidents();
  }

  getAccidents(): void {
    this.accidentsStore.setLoading(true);
    this.accidentsService.getAccidents().subscribe({
      next: (data) => {
        this.accidentsStore.setDefaultAccidents(data);
        this.accidentsStore.setAccidents(data);
        this.accidentsStore.setLoading(false);
      },
      error: (err) => {
        this.accidentsStore.setLoading(false);
        this.accidentsStore.setError('Помилка завантаження даних про аварії');
        console.error('Error loading accidents:', err);
      },
    });
  }
}
