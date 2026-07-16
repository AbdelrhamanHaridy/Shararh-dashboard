import { Routes } from '@angular/router';

export const authRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./auth').then((m) => m.Auth),
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
