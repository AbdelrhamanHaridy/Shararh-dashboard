import { Routes } from '@angular/router';
import { salariesAndPerformanceIndicatorsRoutes } from './pages/salaries-and-performance-indicators/salaries-and-performance-indicators.routing';

export const moreRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./more').then((m) => m.More),
  },
  {
    path: 'trusted-devices',
    loadComponent: () =>
      import('./pages/trusted-devices/trusted-devices').then((m) => m.TrustedDevices),
  },
  {
    path: 'payment-methods-settings',
    loadComponent: () =>
      import('./pages/payment-methods-settings/payment-methods-settings').then(
        (m) => m.PaymentMethodsSettings,
      ),
  },
  // {
  //   path: 'salaries-and-performance-indicators',
  //   loadComponent: () =>
  //     import('./pages/salaries-and-performance-indicators/salaries-and-performance-indicators').then((m) => m.SalariesAndPerformanceIndicators),
  // },
  {
    path: 'salaries-and-performance-indicators',
    children: salariesAndPerformanceIndicatorsRoutes,
  },
  {
    path: 'accounts-and-permissions',
    loadComponent: () =>
      import('./pages/accounts-and-permissions/accounts-and-permissions').then(
        (m) => m.AccountsAndPermissions,
      ),
  },
  {
    path: 'coupons-and-discount-codes',
    loadComponent: () =>
      import('./pages/coupons-and-discount-codes/coupons-and-discount-codes').then(
        (m) => m.CouponsAndDiscountCodes,
      ),
  },
  {
    path: 'pricing-and-plans',
    loadComponent: () =>
      import('./pages/pricing-and-plans/pricing-and-plans').then((m) => m.PricingAndPlans),
  },

  //   {
  //     path: 'revenue-log',
  //     loadComponent: () =>
  //       import('./pages/revenue-log/revenue-log').then((m) => m.RevenueLog),
  //   },
  //   {
  //     path: 'debt-accounts',
  //     loadComponent: () =>
  //       import('./pages/debt-accounts/debt-accounts').then((m) => m.DebtAccounts),
  //   },
];
