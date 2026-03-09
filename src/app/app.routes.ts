import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'workshop',
        loadChildren: () => import('./features/workshop/workshop.routes').then(m => m.WORKSHOP_ROUTES)
      },
      // Placeholder for future features
      {
        path: 'users',
        data: { role: 'admin' },
        canActivate: [roleGuard],
        loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent) // Reusing dashboard as placeholder
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
