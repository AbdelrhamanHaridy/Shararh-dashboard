import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SharedKpiCard } from '../../../../shared/components/shared-kpi-card/shared-kpi-card';
import { SharedSelectComponent } from '../../../../shared/components/shared-select/shared-select.component';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';

@Component({
  selector: 'app-archive-sessions',
  imports: [PageHeaderComponent, SharedKpiCard, SharedSelectComponent, SharedTableComponent],
  templateUrl: './archive-sessions.html',
  styleUrl: './archive-sessions.scss',
})
export class ArchiveSessions {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };
  breadcrumbItems: MenuItem[] = [
    { label: 'الارشيف' },
    { label: 'ارشيف الجلسات', routerLink: '/archive-sessions' },
  ];
  contactViaOptions = [
    { label: 'هاتف', value: 'phone' },
    { label: 'بريد الكتروني', value: 'email' },
    { label: 'واتس اب', value: 'whatsapp' },
    { label: 'الموقع المجاني', value: 'website' },
  ];
  columns = [
    { field: 'username', header: 'اسم المستخدم' },
    { field: 'fullName', header: 'الاسم الكامل' },
    { field: 'role', header: 'الدور' },
    { field: 'storeName', header: 'اسم المحل' },
    { field: 'deviceCount', header: 'عدد الأجهزة' },
    { field: 'version', header: 'الإصدار' },
    { field: 'activity', header: 'الحالة' },
  ];

  users = [
    {
      username: 'ahmed.h',
      fullName: 'أحمد حسن',
      role: 'مدير',
      storeName: 'متجر التقنية',
      deviceCount: 2,
      version: 'v2.1.0',
      activity: 'نشط',
    },
    {
      username: 'mo.ali',
      fullName: 'محمد علي',
      role: 'موظف',
      storeName: 'سوبر ماركت الوفاء',
      deviceCount: 1,
      version: 'v2.0.5',
      activity: 'نشط',
    },
    {
      username: 'omar.k',
      fullName: 'عمر خالد',
      role: 'مدير فرع',
      storeName: 'محل الأصدقاء',
      deviceCount: 3,
      version: 'v2.1.0',
      activity: 'نشط',
    },
    {
      username: 'youssef.n',
      fullName: 'يوسف نبيل',
      role: 'موظف',
      storeName: 'متجر الملابس',
      deviceCount: 1,
      version: 'v2.0.0',
      activity: 'غير نشط',
    },
    {
      username: 'karim.s',
      fullName: 'كريم سمير',
      role: 'مدير',
      storeName: 'محل الإلكترونيات',
      deviceCount: 2,
      version: 'v2.1.0',
      activity: 'نشط',
    },
    {
      username: 'tarek.f',
      fullName: 'طارق فوزي',
      role: 'موظف',
      storeName: 'سوبر ماركت النيل',
      deviceCount: 1,
      version: 'v2.0.8',
      activity: 'نشط',
    },
  ];
  totalUsers = this.users.length;
}
