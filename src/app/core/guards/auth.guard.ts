import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthService } from '../../dashboard/pages/auth/services/auth.service';

export const authGuard: CanActivateFn = (): boolean | UrlTree => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Step 1: Check if user is logged in
  if (!authService.isLoggedIn()) {
    console.log('❌ Auth Guard: User not authenticated, redirecting to login');
    return router.parseUrl('/auth/login');
  }

  // Step 2: Get current user
  const currentUser = authService.getCurrentUser();

  // Step 3: Check if user has admin role
  if (!currentUser || !currentUser.roles?.includes('admin')) {
    console.log('❌ Auth Guard: User is not admin, redirecting to unauthorized');
    return router.parseUrl('/unauthorized');
  }

  // User is authenticated AND has admin role
  console.log('✅ Auth Guard: User is admin, allowing access');
  return true;
};
