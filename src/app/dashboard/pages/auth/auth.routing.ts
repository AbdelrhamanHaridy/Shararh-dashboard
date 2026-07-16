import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth').then((m) => m.Auth),
    children: [
      {
        path: 'register',
        loadComponent: () =>
          import('./pages/auth-register/auth-register').then((m) => m.AuthRegister),
      },
      {
        path: 'login',
        loadComponent: () => import('./pages/auth-login/auth-login').then((m) => m.AuthLogin),
      },
      {
        path: 'forgot-password',
        loadComponent: () =>
          import('./pages/forgot-password/forgot-password').then((m) => m.ForgotPassword),
      },
      {
        path: 'otp',
        loadComponent: () => import('./pages/otp/otp').then((m) => m.Otp),
      },
      {
        path: 'reset-password',
        loadComponent: () =>
          import('./pages/reset-password/reset-password').then((m) => m.ResetPassword),
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
