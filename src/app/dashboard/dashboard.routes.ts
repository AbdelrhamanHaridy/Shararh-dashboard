import { Routes } from '@angular/router';
import { userDatabaseRoutes } from './pages/user-database/user-database.routing';
import { archiveRoutes } from './pages/archive/archive.routing';
import { moreRoutes } from './pages/more/more.routing';
import { authRoutes } from './pages/auth/auth.routing';
import { sessionsRoutes } from './pages/sessions/sessions.routing';
import { loginGuard } from '../core/guards/login.guard';
import { authGuard } from '../core/guards/auth.guard';

export const dashboardRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'auth',
    children: authRoutes,
    canActivate: [loginGuard],
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/home').then((m) => m.Home),
    canActivate: [authGuard],
  },
  {
    path: 'user-database',
    children: userDatabaseRoutes,
    canActivate: [authGuard],
  },
  {
    path: 'subscription-management',
    loadComponent: () =>
      import('./pages/subscription-management/subscription-management').then(
        (m) => m.SubscriptionManagement,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'potential-customer-center',
    loadComponent: () =>
      import('./pages/potential-customer-center/potential-customer-center').then(
        (m) => m.PotentialCustomerCenter,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'contact-log',
    loadComponent: () => import('./pages/contact-log/contact-log').then((m) => m.ContactLog),
    canActivate: [authGuard],
  },
  {
    path: 'progress-board',
    loadComponent: () =>
      import('./pages/progress-board/progress-board').then((m) => m.ProgressBoard),
    canActivate: [authGuard],
  },
  {
    path: 'version-control-and-updates',
    loadComponent: () =>
      import('./pages/version-control-and-updates/version-control-and-updates').then(
        (m) => m.VersionControlAndUpdates,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'notifications',
    loadComponent: () => import('./pages/notifications/notifications').then((m) => m.Notifications),
    canActivate: [authGuard],
  },
  {
    path: 'complaints-and-suggestions',
    loadComponent: () =>
      import('./pages/complaints-and-suggestions/complaints-and-suggestions').then(
        (m) => m.ComplaintsAndSuggestions,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'frequently-asked-questions',
    loadComponent: () =>
      import('./pages/frequently-asked-questions/frequently-asked-questions').then(
        (m) => m.FrequentlyAskedQuestions,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'sessions',
    children: sessionsRoutes,
    canActivate: [authGuard],
  },
  {
    path: 'archive',
    children: archiveRoutes,
    canActivate: [authGuard],
  },
  {
    path: 'more',
    children: moreRoutes,
    canActivate: [authGuard],
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings').then((m) => m.Settings),
    canActivate: [authGuard],
  },
];
