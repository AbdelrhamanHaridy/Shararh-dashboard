import { Routes } from '@angular/router';
import { userDatabaseRoutes } from './pages/user-database/user-database.routing';

export const dashboardRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
  },
  {
    path: 'user-database',
    children: userDatabaseRoutes,
  },
  {
    path: 'subscription-management',
    loadComponent: () =>
      import('./pages/subscription-management/subscription-management').then(
        (m) => m.SubscriptionManagement,
      ),
  },
];
