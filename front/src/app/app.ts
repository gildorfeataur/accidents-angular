import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AccidentsStore } from './stores/accidents/accidents.store';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  imports: [RouterOutlet],
})
export class App {
  constructor(private accidentsStore: AccidentsStore) {}

  ngOnInit(): void {
    this.accidentsStore.getAccidents();
  }
}
