import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-accident-popup',
  templateUrl: './accident-popup.component.html',
  styleUrls: ['./accident-popup.component.scss'],
})
export class AccidentPopup {
  @Input() status: string = '';
  @Input() lat: number = 0;
  @Input() lng: number = 0;
  @Input() timestamp: string = new Date().toLocaleString();
}
