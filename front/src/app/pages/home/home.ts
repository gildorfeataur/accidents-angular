import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FilterComponent } from '../../components/filter/filter.component';

@Component({
  selector: 'app-home',
  imports: [FilterComponent, RouterLink],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  standalone: true,
})
export class HomePage {
  protected title = 'Transport Accidents Homepage';
}
