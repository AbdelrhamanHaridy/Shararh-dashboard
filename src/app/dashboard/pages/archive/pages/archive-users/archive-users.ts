import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { UserDatabaseService } from '../../../user-database/services/user-database.service';
import { User } from '../../../user-database/models/user-database.model';

@Component({
  selector: 'app-archive-users',
  imports: [SharedTableComponent, PageHeaderComponent],
  templateUrl: './archive-users.html',
  styleUrl: './archive-users.scss',
})
export class ArchiveUsers implements OnInit {
  private router = inject(Router);
  private usersService = inject(UserDatabaseService);
  private cdr = inject(ChangeDetectorRef);

  isLoading = false;

  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/home' };

  breadcrumbItems: MenuItem[] = [{ label: 'قاعدة بيانات المستخدمين', routerLink: '/users' }];

  onAddUser(): void {
    this.router.navigate(['/user-database/add-new-user/add-merchant-for-first-time']);
  }

  columns = [
    { field: 'full_name', header: 'الاسم' },
    { field: 'email', header: 'البريد الإلكتروني' },
    { field: 'phone', header: 'رقم الهاتف' },
    {
      field: 'account_status',
      header: 'الحالة',
      style: { fontWeight: 'bold' },
    },
    {
      field: 'roles',
      header: 'الأدوار',
      style: { fontWeight: 'bold', color: '#B34E0A' },
      render: (row: User) => row.roles?.join(', ') || '-',
    },
    // { field: 'actions', header: '' },
  ];

  users: User[] = [];
  totalUsers = 0;

  ngOnInit(): void {
    this.loadArchivedUsers();
  }

  private loadArchivedUsers(): void {
    this.isLoading = true;
    this.usersService.getArchivedUsers().subscribe({
      next: (res) => {
        this.users = res.data;
        this.totalUsers = res.data.length;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load archived users', err);
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }
}
