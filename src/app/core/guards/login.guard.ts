import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../dashboard/pages/auth/services/auth.service';

export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    const currentUser = authService.getCurrentUser();
    const roles = Array.isArray(currentUser?.roles) ? currentUser.roles : [];
    const employeeRoles = ['supervisor', 'customer_service', 'sales', 'technical_support'];

    return router.parseUrl(
      roles.some((role) => employeeRoles.includes(role)) ? '/employee-dashboard' : '/home',
    );
  }

  return true;
};
