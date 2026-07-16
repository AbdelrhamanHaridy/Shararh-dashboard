import { Routes } from '@angular/router';

export const accountsAndPermissionsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./accounts-and-permissions').then((m) => m.AccountsAndPermissions),
  },
  {
    path: 'add-new-account',
    loadComponent: () =>
      import('./pages/accounts-and-permissions-add-new-account/accounts-and-permissions-add-new-account').then(
        (m) => m.AccountsAndPermissionsAddNewAccount,
      ),
  },
];
