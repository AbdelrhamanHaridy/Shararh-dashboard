import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-salaries-and-performance-indicators',
  imports: [PageHeaderComponent],
  templateUrl: './salaries-and-performance-indicators.html',
  styleUrl: './salaries-and-performance-indicators.scss',
})
export class SalariesAndPerformanceIndicators {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };

  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'الأجهزة الموثوقة', routerLink: '/trusted-devices' },
  ];
}
