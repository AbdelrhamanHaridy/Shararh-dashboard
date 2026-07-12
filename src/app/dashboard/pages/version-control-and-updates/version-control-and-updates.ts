import { Component, signal } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-version-control-and-updates',
  imports: [PageHeaderComponent],
  templateUrl: './version-control-and-updates.html',
  styleUrl: './version-control-and-updates.scss',
})
export class VersionControlAndUpdates {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };
  breadcrumbItems: MenuItem[] = [
    { label: 'إدارة النسخ والتحديثات', routerLink: '/version-control-and-updates' },
  ];

  // Dummy merchants data for the merchant boxes preview
  merchants = [
    {
      id: 101,
      name: 'محل الوردة',
      location: 'الحي التجاري',
      apps: [
        {
          id: 'm101-a1',
          badgeLabel: 'محدث',
          badgeColor: '#065F46',
          badgeBgColor: '#ECFDF5',
          name: 'نقطة البيع',
          devicesCount: 5,
          version: '1.4.2',
          iconUrl: 'assets/icons/global/blue_check.svg',
        },
        {
          id: 'm101-a2',
          badgeLabel: 'متأخر',
          badgeColor: '#C2410C',
          badgeBgColor: '#FFF4E6',
          name: 'التقارير',
          devicesCount: 2,
          version: '0.9.8',
          iconUrl: 'assets/icons/global/blue_bag.svg',
        },
      ],
    },
    {
      id: 102,
      name: 'صيدلية الشفاء',
      location: 'شارع النصر',
      apps: [
        {
          id: 'm102-a1',
          badgeLabel: 'محدث',
          badgeColor: '#065F46',
          badgeBgColor: '#ECFDF5',
          name: 'النقطة',
          devicesCount: 3,
          version: '2.0.1',
          iconUrl: 'assets/icons/global/blue_check.svg',
        },
      ],
    },
    {
      id: 103,
      name: 'مطعم الأصالة',
      location: 'المنطقة الصناعية',
      apps: [
        {
          id: 'm103-a1',
          badgeLabel: 'قيد التحديث',
          badgeColor: '#B45309',
          badgeBgColor: '#FFFAEB',
          name: 'خدمة الطلبات',
          devicesCount: 8,
          version: '1.0.0',
          iconUrl: 'assets/icons/global/blue_check.svg',
        },
      ],
    },
  ];
}
