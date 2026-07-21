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
    { field: 'fullName', header: 'الاسم' },
    { field: 'role_text', header: 'الدور', style: { fontWeight: 'bold', color: '#B34E0A' } },
    { field: 'storeName', header: 'اسم المحل', style: { fontWeight: 'bold', color: '#717171' } },
    {
      field: 'deviceCount',
      header: 'عدد الأجهزة',
      style: { fontWeight: 'bold', color: '#717171' },
    },
    { field: 'version', header: 'الإصدارات', style: { fontWeight: 'bold', color: '#717171' } },
    { field: 'activity', header: 'النشاط', style: { fontWeight: 'medium', color: '#0D7F1A' } },
    { field: 'actions', header: '' },
  ];

  users = [
    {
      username: 'ahmed.h',
      fullName: 'أحمد حسن',
      role_text: 'مدير',
      storeName: 'متجر التقنية',
      deviceCount: 2,
      version: 'v2.1.0',
      activity: 'نشط',
    },
    {
      username: 'mo.ali',
      fullName: 'محمد علي',
      role_text: 'موظف',
      storeName: 'سوبر ماركت الوفاء',
      deviceCount: 1,
      version: 'v2.0.5',
      activity: 'نشط',
    },
    {
      username: 'omar.k',
      fullName: 'عمر خالد',
      role_text: 'مدير فرع',
      storeName: 'محل الأصدقاء',
      deviceCount: 3,
      version: 'v2.1.0',
      activity: 'نشط',
    },
    {
      username: 'youssef.n',
      fullName: 'يوسف نبيل',
      role_text: 'موظف',
      storeName: 'متجر الملابس',
      deviceCount: 1,
      version: 'v2.0.0',
      activity: 'غير نشط',
    },
    {
      username: 'karim.s',
      fullName: 'كريم سمير',
      role_text: 'مدير',
      storeName: 'محل الإلكترونيات',
      deviceCount: 2,
      version: 'v2.1.0',
      activity: 'نشط',
    },
    {
      username: 'tarek.f',
      fullName: 'طارق فوزي',
      role_text: 'موظف',
      storeName: 'سوبر ماركت النيل',
      deviceCount: 1,
      version: 'v2.0.8',
      activity: 'نشط',
    },
  ];

  totalUsers = this.users.length;
}
