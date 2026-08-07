import { Routes } from '@angular/router';

export const sessionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./sessions').then((m) => m.Sessions),
  },
  {
    path: 'session-details',
    loadComponent: () =>
      import('./pages/session-details/session-details').then(
        (m) => m.SessionDetails,
      ),
  },
];
