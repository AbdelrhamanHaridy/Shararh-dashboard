import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-payment-methods-settings',
  imports: [PageHeaderComponent],
  templateUrl: './payment-methods-settings.html',
  styleUrl: './payment-methods-settings.scss',
})
export class PaymentMethodsSettings {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };

  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'الأجهزة الموثوقة', routerLink: '/trusted-devices' },
  ];
}
