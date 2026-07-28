import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedKpiCard } from '../../shared/components/shared-kpi-card/shared-kpi-card';
import { SharedTableComponent } from '../../shared/components/shared-table/shared-table.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { BaseComponent } from '../../shared/services/base.component';
import { takeUntil } from 'rxjs';
import { UserDatabaseService } from './services/user-database.service';
import { User } from './models/user-database.model';

@Component({
  selector: 'app-user-database',
  imports: [SharedKpiCard, SharedTableComponent, PageHeaderComponent],
  templateUrl: './user-database.html',
  styleUrl: './user-database.scss',
})
export class UserDatabase extends BaseComponent implements OnInit {
  private router = inject(Router);
  private usersService = inject(UserDatabaseService);
  private cdr = inject(ChangeDetectorRef);

  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };

  breadcrumbItems: MenuItem[] = [{ label: 'قاعدة بيانات المستخدمين', routerLink: '/users' }];

  onAddUser(): void {
    this.router.navigate(['/user-database/add-new-user/add-merchant-for-first-time']);
  }

  // columns = [
  //   { field: 'username', header: 'اسم المستخدم' },
  //   { field: 'fullName', header: 'الاسم' },
  //   { field: 'role_text', header: 'الدور', style: { fontWeight: 'bold', color: '#B34E0A' } },
  //   { field: 'storeName', header: 'اسم المحل', style: { fontWeight: 'bold', color: '#717171' } },
  //   {
  //     field: 'deviceCount',
  //     header: 'عدد الأجهزة',
  //     style: { fontWeight: 'bold', color: '#717171' },
  //   },
  //   { field: 'version', header: 'الإصدارات', style: { fontWeight: 'bold', color: '#717171' } },
  //   { field: 'activity', header: 'النشاط', style: { fontWeight: 'medium', color: '#0D7F1A' } },
  //   { field: 'actions', header: '' },
  // ];
  columns = [
    { field: 'full_name', header: 'الاسم' },
    { field: 'email', header: 'البريد الإلكتروني' },
    { field: 'phone', header: 'رقم الهاتف' },
    {
      field: 'status',
      header: 'الحالة',
      style: { fontWeight: 'bold' },
    },
    {
      field: 'roles',
      header: 'الأدوار',
      style: { fontWeight: 'bold', color: '#B34E0A' },
      // If your table supports custom rendering
      render: (row: User) => row.roles?.join(', ') || '-',
    },
    { field: 'actions', header: '' },
  ];

  users: User[] = [];

  totalUsers = this.users.length;
  ngOnInit(): void {
    this.onGetUsers();
  }
  onGetUsers() {
    this.usersService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.users = res.data.map((user) => ({
            ...user,
            status: user.account_status,
            // role: user.roles?.[0] || '',

          }));
          this.totalUsers = this.users.length;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching data:', err);
        },
      });
  }
}
