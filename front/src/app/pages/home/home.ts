import { Component } from '@angular/core';
import { Navigation } from '../../components/navigation/navigation';
import { FilterComponent } from '../../components/filter/filter.component';

@Component({
  selector: 'app-home',
  imports: [Navigation, FilterComponent],
  templateUrl: './home.html',
  standalone: true,
})
export class HomePage {
  protected title = 'Transport Accidents Home';
}
