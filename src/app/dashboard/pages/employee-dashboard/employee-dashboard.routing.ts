import { Routes } from '@angular/router';

export const employeeDashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./employee-dashboard').then((m) => m.EmployeeDashboard),
  },
  {
    path: 'suggested-tasks',
    loadComponent: () =>
      import('./pages/employee-suggested-tasks/employee-suggested-tasks').then(
        (m) => m.EmployeeSuggestedTasks,
      ),
    // children: [
    //   {
    //     path: 'add-merchant-for-first-time',
    //     loadComponent: () =>
    //       import('./pages/add-merchant-for-first-time/add-merchant-for-first-time').then(
    //         (m) => m.AddMerchantForFirstTime,
    //       ),
    //   },
    //   {
    //     path: 'add-new-user-to-existing-merchant',
    //     loadComponent: () =>
    //       import('./pages/add-new-user-to-existing-merchant/add-new-user-to-existing-merchant').then(
    //         (m) => m.AddNewUserToExistingMerchant,
    //       ),
    //   },
    // ],
  },
];
