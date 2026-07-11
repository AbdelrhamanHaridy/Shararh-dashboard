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
  {
    path: 'potential-customer-center',
    loadComponent: () =>
      import('./pages/potential-customer-center/potential-customer-center').then(
        (m) => m.PotentialCustomerCenter,
      ),
  },
  {
    path: 'contact-log',
    loadComponent: () =>
      import('./pages/contact-log/contact-log').then(
        (m) => m.ContactLog,
      ),
  },
  {
    path: 'progress-board',
    loadComponent: () =>
      import('./pages/progress-board/progress-board').then(
        (m) => m.ProgressBoard,
      ),
  },
];
