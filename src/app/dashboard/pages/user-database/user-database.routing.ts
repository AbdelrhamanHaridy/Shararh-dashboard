import { Routes } from '@angular/router';

export const userDatabaseRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./user-database').then((m) => m.UserDatabase),
  },
  {
    path: 'add-new-user',
    loadComponent: () =>
      import('./pages/add-new-user-layout/add-new-user-layout').then((m) => m.AddNewUserLayout),
    children: [
      {
        path: 'add-merchant-for-first-time',
        loadComponent: () =>
          import('./pages/add-merchant-for-first-time/add-merchant-for-first-time').then(
            (m) => m.AddMerchantForFirstTime,
          ),
      },
      {
        path: 'add-new-user-to-existing-merchant',
        loadComponent: () =>
          import('./pages/add-new-user-to-existing-merchant/add-new-user-to-existing-merchant').then(
            (m) => m.AddNewUserToExistingMerchant,
          ),
      },
    ],
  },
];
