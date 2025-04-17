import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StageHealth, ProductionOutput } from '../models/factory.model';

@Injectable({
  providedIn: 'root'
})
export class FactoryService {
  private apiUrl = '/api/factory';

  constructor(private http: HttpClient) { }

  getAllStagesHealth(): Observable<StageHealth[]> {
    return this.http.get<StageHealth[]>(`${this.apiUrl}/stages/health`);
  }

  getStageHealth(stageId: number): Observable<StageHealth> {
    return this.http.get<StageHealth>(`${this.apiUrl}/stages/${stageId}/health`);
  }

  updateDeviceHealth(deviceId: number, operational: boolean, healthScore: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/devices/${deviceId}/health`, {
      operational,
      healthScore
    });
  }

  getStageOutput(stageOrder: number, startTime: string, endTime: string): Observable<ProductionOutput> {
    return this.http.get<ProductionOutput>(
      `${this.apiUrl}/stages/${stageOrder}/output?startTime=${startTime}&endTime=${endTime}`
    );
  }

  getAllStagesOutput(startTime: string, endTime: string): Observable<ProductionOutput[]> {
    return this.http.get<ProductionOutput[]>(
      `${this.apiUrl}/output?startTime=${startTime}&endTime=${endTime}`
    );
  }

  recordProductionMetrics(deviceId: number, metrics: {
    unitsProduced: number,
    defectiveUnits: number,
    cycleTimeMinutes: number
  }): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/devices/${deviceId}/metrics`, metrics);
  }
}
