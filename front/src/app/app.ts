import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { FilterComponent } from './components/filter/filter.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.scss',
  imports: [RouterOutlet, RouterLink, FilterComponent, FilterComponent],
})
export class App {
  protected title = 'Transport Accidents Calculator';
}
