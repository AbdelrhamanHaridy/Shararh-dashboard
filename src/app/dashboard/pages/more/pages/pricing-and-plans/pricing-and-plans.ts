import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-pricing-and-plans',
  imports: [PageHeaderComponent],
  templateUrl: './pricing-and-plans.html',
  styleUrl: './pricing-and-plans.scss',
})
export class PricingAndPlans {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };

  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'التسعير والباقات', routerLink: '/pricing-and-plans' },
  ];
}
