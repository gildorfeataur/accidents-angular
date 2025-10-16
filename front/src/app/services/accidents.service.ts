import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Accident {
  id: string;
  title: string;
  category: string;
  severity: number;
  lat: number;
  lng: number;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccidentsService {
  private readonly apiUrl = 'http://localhost:4000/accidents';

  constructor(private http: HttpClient) {}

  getAccidents(): Observable<Accident[]> {
    return this.http.get<Accident[]>(this.apiUrl);
  }

  getAccidentById(id: string): Observable<Accident> {
    return this.http.get<Accident>(`${this.apiUrl}/${id}`);
  }
}
