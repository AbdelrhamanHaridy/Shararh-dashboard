import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'user-database',
    loadComponent: () => import('./pages/user-database/user-database').then((m) => m.UserDatabase),
  },
  {
    path: 'subscription-management',
    loadComponent: () =>
      import('./pages/subscription-management/subscription-management').then(
        (m) => m.SubscriptionManagement,
      ),
  },
];
