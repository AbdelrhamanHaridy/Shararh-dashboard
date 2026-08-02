import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../dashboard/pages/auth/services/auth.service';

export const adminGuard: CanActivateFn = (): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return router.parseUrl('/auth/login');
  }

  const roles: string[] = Array.isArray(currentUser.roles) ? currentUser.roles : [];

  // Only admins can access this route
  if (roles.includes('admin')) {
    return true;
  }

  // Non-admin users redirect to employee dashboard
  return router.parseUrl('/dashboard/employee-dashboard');
};
