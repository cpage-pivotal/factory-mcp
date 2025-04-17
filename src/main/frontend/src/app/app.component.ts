import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="container">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
        <div class="container-fluid">
          <a class="navbar-brand" href="#">Auto Factory</a>
          <div class="collapse navbar-collapse">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <a class="nav-link" routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/factory-health" routerLinkActive="active">Factory Health</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/supply-chain" routerLinkActive="active">Supply Chain</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <router-outlet></router-outlet>
    </div>
  `
})
export class AppComponent {
  title = 'Auto Factory Management';
}
