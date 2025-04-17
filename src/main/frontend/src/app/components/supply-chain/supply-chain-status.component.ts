import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplyChainService } from '../../services/supply-chain.service';
import { SupplyChainStatus, DailyTarget } from '../../models/factory.model';

@Component({
  selector: 'app-supply-chain-status',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './supply-chain-status.component.html',
  styleUrls: ['./supply-chain-status.component.css']
})
export class SupplyChainStatusComponent implements OnInit {
  status: SupplyChainStatus | null = null;
  selectedDate: string = new Date().toISOString().split('T')[0]; // Today in YYYY-MM-DD format
  newTarget: number = 0;
  loading = true;
  error = '';
  successMessage = '';

  constructor(private supplyChainService: SupplyChainService) { }

  ngOnInit(): void {
    this.loadSupplyChainStatus();
  }

  loadSupplyChainStatus(): void {
    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.supplyChainService.getStatusByDate(this.selectedDate).subscribe({
      next: (data) => {
        this.status = data;
        this.newTarget = data.dailyTarget;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load supply chain status';
        this.loading = false;
        console.error(err);
      }
    });
  }

  updateDailyTarget(): void {
    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.supplyChainService.setDailyTarget(this.selectedDate, this.newTarget).subscribe({
      next: (_) => {
        this.successMessage = 'Daily target updated successfully';
        this.loadSupplyChainStatus();
      },
      error: (err) => {
        this.error = 'Failed to update daily target';
        this.loading = false;
        console.error(err);
      }
    });
  }

  onDateChange(): void {
    this.loadSupplyChainStatus();
  }

  getStatusClass(onTrack: boolean): string {
    return onTrack ? 'text-success' : 'text-danger';
  }

  getProgressBarClass(percentage: number): string {
    if (percentage >= 90) return 'bg-success';
    if (percentage >= 70) return 'bg-info';
    if (percentage >= 50) return 'bg-warning';
    return 'bg-danger';
  }
}
