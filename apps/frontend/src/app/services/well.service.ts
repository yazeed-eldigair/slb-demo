import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Well } from '../models/well.model';

@Injectable({
  providedIn: 'root'
})
export class WellService {
  private apiUrl = '/api/wells/';

  constructor(private http: HttpClient) { }

  getWells(): Observable<Well[]> {
    return this.http.get<Well[]>(this.apiUrl);
  }

  getWell(id: number): Observable<Well> {
    return this.http.get<Well>(`${this.apiUrl}${id}`);
  }
}
