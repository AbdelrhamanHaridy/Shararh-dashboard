import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../dashboard/pages/auth/services/auth.service';
import { SessionService } from '../../dashboard/pages/auth/services/session.service';
import { catchError, map, of } from 'rxjs';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const sessionService = inject(SessionService);
  const router = inject(Router);

  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return router.parseUrl('/auth/login');
  }

  const roles: string[] = Array.isArray(currentUser.roles) ? currentUser.roles : [];
  const employeeRoles = ['supervisor', 'customer_service', 'sales', 'technical_support'];

  // Only admins can access this route
  if (roles.includes('admin') && !roles.some((r) => employeeRoles.includes(r))) {
    return true;
  }

  if (roles.some((role) => employeeRoles.includes(role))) {
    return sessionService.getCurrentSession().pipe(
      map((response) =>
        response.success
          ? router.parseUrl('/employee-dashboard')
          : router.parseUrl('/auth/start-session'),
      ),
      catchError((error) => {
        if (error?.status === 404) {
          return of(router.parseUrl('/auth/start-session'));
        }

        console.error('Failed to check employee session:', error);
        return of(router.parseUrl('/auth/start-session'));
      }),
    );
  }

  return router.parseUrl('/home');
};
