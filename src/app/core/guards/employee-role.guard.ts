import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../dashboard/pages/auth/services/auth.service';
import { SessionService } from '../../dashboard/pages/auth/services/session.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const employeeRoleGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const sessionService = inject(SessionService);
  const router = inject(Router);

  // Step 1: Check authentication
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return router.parseUrl('/auth/login');
  }

  // Step 2: Check employee role
  const roles: string[] = Array.isArray(currentUser.roles) ? currentUser.roles : [];

  const employeeRoles = ['supervisor', 'customer_service', 'sales', 'technical_support'];

  const isEmployee = roles.some((role) => employeeRoles.includes(role));

  if (!isEmployee) {
    return router.parseUrl('/home');
  }

  // Step 3: Check active session
  return sessionService.getCurrentSession().pipe(
    map((response) => {
      // Active session: allow dashboard access
      if (response.success) {
        return true;
      }

      // No active session: redirect to start session
      return router.parseUrl('/auth/start-session');
    }),

    catchError((error) => {
      // No active session
      if (error?.status === 404) {
        return of(router.parseUrl('/auth/start-session'));
      }

      // Other errors: deny dashboard access
      console.error('Employee Role Guard: Error checking session status:', error);

      return of(router.parseUrl('/home'));
    }),
  );
};
