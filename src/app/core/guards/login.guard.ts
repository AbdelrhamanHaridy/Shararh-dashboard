import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../dashboard/pages/auth/services/auth.service';

export const loginGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
    console.log(authService.isLoggedIn());
    
  // If user is already logged in, redirect to dashboard home
  if (authService.isLoggedIn()) {
    router.navigate(['/home']);
    return false;
  }

  // Allow access to login/register pages if not logged in
  return true;
};
