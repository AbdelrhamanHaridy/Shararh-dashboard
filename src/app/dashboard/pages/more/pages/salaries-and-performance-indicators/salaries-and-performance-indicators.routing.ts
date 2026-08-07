import { Routes } from '@angular/router';

export const salariesAndPerformanceIndicatorsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./salaries-and-performance-indicators').then(
        (m) => m.SalariesAndPerformanceIndicators,
      ),
  },
  {
    path: 'salary-calculation',
    loadComponent: () =>
      import('./pages/salary-calculation/salary-calculation').then((m) => m.SalaryCalculation),
  },
];
