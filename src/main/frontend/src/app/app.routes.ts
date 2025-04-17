import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FactoryHealthComponent } from './components/factory-health/factory-health.component';
import { SupplyChainStatusComponent } from './components/supply-chain/supply-chain-status.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'factory-health', component: FactoryHealthComponent },
  { path: 'supply-chain', component: SupplyChainStatusComponent }
];
