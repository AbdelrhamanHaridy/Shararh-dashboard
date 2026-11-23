import { Routes } from '@angular/router';
import { employeeSessionGuard } from '../../../core/guards/employee-session.guard';
import { loginGuard } from '../../../core/guards/login.guard';

export const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth').then((m) => m.Auth),
    children: [
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/auth-register/auth-register').then((m) => m.AuthRegister),
        canActivate: [loginGuard],
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/auth-login/auth-login').then((m) => m.AuthLogin),
        canActivate: [loginGuard],
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./pages/forgot-password/forgot-password').then((m) => m.ForgotPassword),
        canActivate: [loginGuard],
      },
      {
        path: 'otp',
        loadComponent: () => import('./pages/otp/otp').then((m) => m.Otp),
        canActivate: [loginGuard],
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./pages/reset-password/reset-password').then((m) => m.ResetPassword),
        canActivate: [loginGuard],
      },
      {
        path: 'start-session',
        loadComponent: () =>
          import('./pages/start-session/start-session').then((m) => m.StartSession),
        canActivate: [employeeSessionGuard],
      },
    ],
  },
  //   {
  //     path: 'trusted-devices',
  //     loadComponent: () =>
  //       import('./pages/trusted-devices/trusted-devices').then((m) => m.TrustedDevices),
  //   },
  //   {
  //     path: 'payment-methods-settings',
  //     loadComponent: () =>
  //       import('./pages/payment-methods-settings/payment-methods-settings').then(
  //         (m) => m.PaymentMethodsSettings,
  //       ),
  //   },
];
