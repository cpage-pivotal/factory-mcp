import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { StageDetailsComponent } from './stage-details/stage-details.component';
import { SupplyChainComponent } from './supply-chain/supply-chain.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'stages/:id', component: StageDetailsComponent },
  { path: 'supply-chain', component: SupplyChainComponent }
];
