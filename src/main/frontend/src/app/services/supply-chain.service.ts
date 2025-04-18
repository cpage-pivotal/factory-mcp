import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SupplyChainStatus } from '../models/supply-chain-status.model';
import { DailyTarget } from '../models/daily-target.model';

@Injectable({
  providedIn: 'root'
})
export class SupplyChainService {
  private apiUrl = '/api/supply-chain';

  constructor(private http: HttpClient) { }

  getCurrentStatus(): Observable<SupplyChainStatus> {
    return this.http.get<SupplyChainStatus>(`${this.apiUrl}/status`);
  }

  getStatusByDate(date: string): Observable<SupplyChainStatus> {
    return this.http.get<SupplyChainStatus>(`${this.apiUrl}/status/${date}`);
  }

  getDailyTarget(date: string): Observable<DailyTarget> {
    return this.http.get<DailyTarget>(`${this.apiUrl}/targets/${date}`);
  }

  setDailyTarget(date: string, targetUnits: number): Observable<DailyTarget> {
    return this.http.post<DailyTarget>(`${this.apiUrl}/targets`, {
      date,
      targetUnits
    });
  }
}
