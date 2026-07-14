import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { SharedKpiCard } from "../../../../shared/components/shared-kpi-card/shared-kpi-card";

@Component({
  selector: 'app-salaries-and-performance-indicators',
  imports: [PageHeaderComponent, SharedKpiCard],
  templateUrl: './salaries-and-performance-indicators.html',
  styleUrl: './salaries-and-performance-indicators.scss',
})
export class SalariesAndPerformanceIndicators {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };

  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'الرواتب ومؤشرات الاداء', routerLink: '/salaries-and-performance-indicators' },
  ];

  // Dummy merchants data for the merchant boxes preview
  paymentMethods = [
    {
      id: 99,
      name: 'أحمد محمد',
      time: 'تفعيل لحظي',
    },
    {
      id: 100,
      name: 'أحمد محمد',
      time: 'تفعيل لحظي',
    },
    {
      id: 101,
      name: 'أحمد محمد',
      time: 'تفعيل لحظي',
      data: [
        {
          name: 'رقم المحفظه',
          value: '01032060389',
        },
        {
          name: 'الاسم',
          value: 'عبدالله رفعت عبدالحميد',
        },
        {
          name: 'النسبه',
          value: '% 1',
        },
      ],
    },
    {
      id: 102,
      name: ' أحمد محمد ',
      time: 'تفعيل لحظي',
      data: [
        {
          name: 'المرجع',
          value: 'abdallahsharara1',
        },
        {
          name: 'رقم الحساب',
          value: '207112774001',
        },
        {
          name: 'البنك',
          value: 'بنك الاسكندرية',
        },
        {
          name: 'المستفيد',
          value: 'عبدالله رفعت عبدالحميد',
        },
      ],
    },
  ];
}
