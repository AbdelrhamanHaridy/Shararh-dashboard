import { Routes } from '@angular/router';

export const archiveRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./archive').then((m) => m.Archive),
  },
  {
    path: 'potential-customer-center',
    loadComponent: () =>
      import('./pages/archive-potential-customer-center/archive-potential-customer-center').then(
        (m) => m.ArchivePotentialCustomerCenter,
      ),
  },
  {
    path: 'sessions',
    loadComponent: () =>
      import('./pages/archive-sessions/archive-sessions').then(
        (m) => m.ArchiveSessions,
      ),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./pages/archive-users/archive-users').then(
        (m) => m.ArchiveUsers,
      ),
  },
];
