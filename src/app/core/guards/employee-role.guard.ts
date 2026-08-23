import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../dashboard/pages/auth/services/auth.service';

export const employeeRoleGuard: CanActivateFn = (): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return router.parseUrl('/auth/login');
  }

  const roles: string[] = Array.isArray(currentUser.roles) ? currentUser.roles : [];

  // Allowed employee roles
  const employeeRoles = ['supervisor', 'customer_service', 'sales', 'technical_support'];

  // Check if user has at least one allowed employee role
  if (roles.some((r) => employeeRoles.includes(r))) {
    return true;
  }

  return router.parseUrl('/home');
};
