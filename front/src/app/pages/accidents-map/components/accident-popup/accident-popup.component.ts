import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-accident-popup',
  templateUrl: './accident-popup.component.html',
  styleUrls: ['./accident-popup.component.scss'],
  standalone: true,
})
export class AccidentPopup {
  @Input() id: string = '';
  @Input() title: string = '';
  @Input() category: string = '';
  @Input() severity: number = 0;
  @Input() lat: number = 0;
  @Input() lng: number = 0;
  @Input() createdAt: string = new Date().toLocaleString();
}
