import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'app-trusted-devices',
  imports: [PageHeaderComponent, BadgeModule],
  templateUrl: './trusted-devices.html',
  styleUrl: './trusted-devices.scss',
})
export class TrustedDevices {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };

  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'الأجهزة الموثوقة', routerLink: '/trusted-devices' },
  ];
}
