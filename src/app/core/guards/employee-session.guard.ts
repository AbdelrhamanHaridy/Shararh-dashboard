import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../dashboard/pages/auth/services/auth.service';
import { SessionService } from '../../dashboard/pages/auth/services/session.service';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const employeeSessionGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const sessionService = inject(SessionService);
  const router = inject(Router);

  // Step 1: Check if user is logged in
  const currentUser = authService.getCurrentUser();
  if (!currentUser) {
    console.log('❌ Employee Session Guard: User not logged in, redirecting to login');
    return router.parseUrl('/auth/login');
  }

  // Step 2: Check if user is an employee
  const roles: string[] = Array.isArray(currentUser.roles) ? currentUser.roles : [];
  const employeeRoles = ['supervisor', 'customer_service', 'sales', 'technical_support'];
  const isEmployee = roles.some((r) => employeeRoles.includes(r));

  if (!isEmployee) {
    console.log('❌ Employee Session Guard: User is not an employee, redirecting to home');
    return router.parseUrl('/home');
  }

  console.log('✅ Employee Session Guard: User is an employee, checking active session...');

  // Step 3: Check if employee has an active session
  return sessionService.getCurrentSession().pipe(
    map((response) => {
      // If session is active, redirect to employee dashboard
      if (response.success) {
        console.log(
          '✅ Employee Session Guard: Active session found, redirecting to employee-dashboard',
        );
        return router.parseUrl('/employee-dashboard');
      }
      // If no active session, allow access to start-session page
      console.log('✅ Employee Session Guard: No active session, allowing access to start-session');
      return true;
    }),
    catchError((error) => {
      // If 404, no active session exists, allow access to start-session
      if (error?.status === 404) {
        console.log(
          '✅ Employee Session Guard: No active session (404), allowing access to start-session',
        );
        return of(true);
      }
      // For other errors, still allow access but log the error
      console.error('⚠️ Employee Session Guard: Error checking session status:', error);
      return of(true);
    }),
  );
};
