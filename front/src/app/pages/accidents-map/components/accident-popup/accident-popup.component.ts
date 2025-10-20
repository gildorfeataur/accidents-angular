import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-accident-popup',
  templateUrl: './accident-popup.component.html',
  styleUrls: ['./accident-popup.component.scss'],
  imports: [DatePipe, RouterLink],
  standalone: true,
})
export class AccidentPopup {
  @Input() id: string = '';
  @Input() title: string = '';
  @Input() category: string = '';
  @Input() severity: number = 0;
  @Input() lat: number = 0;
  @Input() lng: number = 0;
  @Input() createdAt: string = '';
}
