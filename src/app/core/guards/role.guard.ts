import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRole = route.data['role'] as 'admin' | 'user';

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
  }

  if (authService.hasRole(requiredRole)) {
    return true;
  }

  // Redirect to dashboard or unauthorized page
  // For now, redirect to dashboard or home
  return router.createUrlTree(['/dashboard']);
};
