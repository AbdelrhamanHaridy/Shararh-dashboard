import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { SharedKpiCard } from '../../shared/components/shared-kpi-card/shared-kpi-card';
import { SharedTableComponent } from '../../shared/components/shared-table/shared-table.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-user-database',
  imports: [SharedKpiCard, SharedTableComponent, PageHeaderComponent],
  templateUrl: './user-database.html',
  styleUrl: './user-database.scss',
})
export class UserDatabase {
  private router = inject(Router);

  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };

  breadcrumbItems: MenuItem[] = [{ label: 'قاعدة بيانات المستخدمين', routerLink: '/users' }];

  onAddUser(): void {
    this.router.navigate(['/user-database/add-new-user/add-merchant-for-first-time']);
  }
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
