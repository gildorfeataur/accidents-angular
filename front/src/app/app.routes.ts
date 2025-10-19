import { Routes } from '@angular/router';
import { AccidentsTablePage } from './pages/accidents-table/accidents-table';
import { AccidentsMapPage } from './pages/accidents-map/accidents-map';
import { AccidentPage } from './pages/accident/accident';
import { NotFound } from './pages/not-found/not-found';

export const routes: Routes = [
  { path: '', redirectTo: 'accidents-table', pathMatch: 'full' },
  { path: 'accidents-table', component: AccidentsTablePage },
  { path: 'accidents-map', component: AccidentsMapPage },
  { path: 'accidents/:id', component: AccidentPage },
  { path: '**', component: NotFound },
];
