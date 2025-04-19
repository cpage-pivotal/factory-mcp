// src/main/frontend/src/app/dashboard/dashboard.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SupplyChainService } from '../services/supply-chain.service';
import { FactoryService } from '../services/factory.service';
import { StageHealth } from '../models/stage-health.model';
import { SupplyChainStatus } from '../models/supply-chain-status.model';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatButtonModule,
    MatIconModule,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  supplyChainStatus: SupplyChainStatus | null = null;
  stagesHealth: StageHealth[] = [];
  loading = true;
  error = false;

  constructor(
    private supplyChainService: SupplyChainService,
    private factoryService: FactoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = false;

    // Load supply chain status
    this.supplyChainService.getCurrentStatus().subscribe({
      next: (data) => {
        this.supplyChainStatus = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading supply chain status', err);
        this.error = true;
        this.loading = false;
      }
    });

    // Load stages health
    this.factoryService.getStagesHealth().subscribe({
      next: (data) => {
        this.stagesHealth = data;
      },
      error: (err) => {
        console.error('Error loading stages health', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  getStatusColor(percentage: number): string {
    if (percentage >= 90) return 'primary';
    if (percentage >= 75) return 'accent';
    return 'warn';
  }

  getHealthColor(score: number): string {
    if (score >= 90) return 'primary';
    if (score >= 70) return 'accent';
    return 'warn';
  }

  viewStageDetails(stageId: number): void {
    this.router.navigate(['/stages', stageId]);
  }

  refreshData(): void {
    this.loadDashboardData();
  }
}
