import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PageHeaderComponent } from '../../../../../../shared/components/page-header/page-header.component';

@Component({
  selector: 'app-salary-calculation',
  imports: [PageHeaderComponent],
  templateUrl: './salary-calculation.html',
  styleUrl: './salary-calculation.scss',
})
export class SalaryCalculation {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };

  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'الرواتب ومؤشرات الاداء', routerLink: '/more/salaries-and-performance-indicators' },
    { label: 'حساب الرواتب', routerLink: '/more/salaries-and-performance-indicators/salary-calculation' },
  ];
}
