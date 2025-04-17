import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactoryService } from '../../services/factory.service';
import { SupplyChainService } from '../../services/supply-chain.service';
import { StageHealth, SupplyChainStatus } from '../../models/factory.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  stagesHealth: StageHealth[] = [];
  supplyChainStatus: SupplyChainStatus | null = null;
  loading = true;
  error = '';

  constructor(
    private factoryService: FactoryService,
    private supplyChainService: SupplyChainService
  ) { }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = '';

    // Get factory health data
    this.factoryService.getAllStagesHealth().subscribe({
      next: (data) => {
        this.stagesHealth = data;

        // Get supply chain status
        this.supplyChainService.getCurrentStatus().subscribe({
          next: (status) => {
            this.supplyChainStatus = status;
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load supply chain status';
            this.loading = false;
            console.error(err);
          }
        });
      },
      error: (err) => {
        this.error = 'Failed to load factory health data';
        this.loading = false;
        console.error(err);
      }
    });
  }

  getHealthStatusClass(score: number): string {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-danger';
  }

  getTargetStatusClass(onTrack: boolean): string {
    return onTrack ? 'text-success' : 'text-danger';
  }
}
