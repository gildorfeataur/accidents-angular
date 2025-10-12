import { Component } from '@angular/core';
import { Navigation } from '../../components/navigation/navigation';

@Component({
  selector: 'app-home',
  imports: [Navigation],
  templateUrl: './home.html',
  standalone: true,
})
export class HomePage {
  protected title = 'Transport Accidents Home';
}
