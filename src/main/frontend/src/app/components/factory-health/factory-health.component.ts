import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FactoryService } from '../../services/factory.service';
import { StageHealth, DeviceHealth } from '../../models/factory.model';

@Component({
  selector: 'app-factory-health',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './factory-health.component.html',
  styleUrls: ['./factory-health.component.css']
})
export class FactoryHealthComponent implements OnInit {
  stagesHealth: StageHealth[] = [];
  selectedStage: StageHealth | null = null;
  loading = true;
  error = '';

  constructor(private factoryService: FactoryService) { }

  ngOnInit(): void {
    this.loadStagesHealth();
  }

  loadStagesHealth(): void {
    this.loading = true;
    this.error = '';

    this.factoryService.getAllStagesHealth().subscribe({
      next: (data) => {
        this.stagesHealth = data;
        this.loading = false;

        if (this.stagesHealth.length > 0) {
          this.selectStage(this.stagesHealth[0]);
        }
      },
      error: (err) => {
        this.error = 'Failed to load factory health data';
        this.loading = false;
        console.error(err);
      }
    });
  }

  selectStage(stage: StageHealth): void {
    this.selectedStage = stage;
  }

  getHealthStatusClass(score: number): string {
    if (score >= 90) return 'text-success';
    if (score >= 70) return 'text-warning';
    return 'text-danger';
  }

  getHealthBadgeClass(score: number): string {
    if (score >= 90) return 'bg-success';
    if (score >= 70) return 'bg-warning';
    return 'bg-danger';
  }

  getOperationalStatusClass(operational: boolean): string {
    return operational ? 'text-success' : 'text-danger';
  }

  getOperationalBadgeClass(operational: boolean): string {
    return operational ? 'bg-success' : 'bg-danger';
  }
}
