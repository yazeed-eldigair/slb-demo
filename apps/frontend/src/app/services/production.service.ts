import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Production, ProductionFilter } from '../models/production.model';

@Injectable({
  providedIn: 'root'
})
export class ProductionService {
  private apiUrl = '/api/production/';

  constructor(private http: HttpClient) { }

  getProductions(): Observable<Production[]> {
    return this.http.get<Production[]>(`${this.apiUrl}?limit=1000`);
  }

  getProduction(id: number): Observable<Production> {
    return this.http.get<Production>(`${this.apiUrl}${id}`);
  }

  filterProduction(filter: ProductionFilter): Observable<Production[]> {
    return this.http.post<Production[]>(`${this.apiUrl}filter/?limit=1000`, filter);
  }
}
