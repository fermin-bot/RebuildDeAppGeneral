import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar.component';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <div class="layout-wrapper flex flex-column h-screen">
      <app-navbar></app-navbar>
      <div class="layout-main-container flex-grow-1 p-4">
        <router-outlet></router-outlet>
      </div>
      <div class="layout-footer p-3 text-center text-500 text-sm border-top-1 surface-border">
        &copy; 2026 FrontendApp. All rights reserved.
      </div>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      background-color: var(--surface-ground);
    }
  `]
})
export class LayoutComponent {}
