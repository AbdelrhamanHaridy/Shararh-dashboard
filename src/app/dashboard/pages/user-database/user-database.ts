// user-database.ts
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedKpiCard } from '../../shared/components/shared-kpi-card/shared-kpi-card';
import { SharedTableComponent } from '../../shared/components/shared-table/shared-table.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { BaseComponent } from '../../shared/services/base.component';
import { takeUntil } from 'rxjs';
import { UserDatabaseService } from './services/user-database.service';
import { User, UserAppType } from './models/user-database.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-database',
  imports: [SharedKpiCard, SharedTableComponent, PageHeaderComponent, CommonModule, FormsModule],
  templateUrl: './user-database.html',
  styleUrl: './user-database.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDatabase extends BaseComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private usersService = inject(UserDatabaseService);
  private cdr = inject(ChangeDetectorRef);

  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/home' };
  breadcrumbItems: MenuItem[] = [{ label: 'قاعدة بيانات المستخدمين', routerLink: '/users' }];

  isLoading: boolean = true;
  searchTerm: string = ''; // NEW: current active filter, bound to the search box too
  selectedType: UserAppType = 'admin_app';
  currentPage: number = 1;
  rowsPerPage: number = 10;

  onAddUser(): void {
    this.router.navigate(['/user-database/add-new-user/add-merchant-for-first-time']);
  }

  columns = [
    { field: 'full_name', header: 'الاسم' },
    { field: 'email', header: 'البريد الإلكتروني' },
    { field: 'phone', header: 'رقم الهاتف' },

    {
      field: 'devices_count',
      header: 'عدد الأجهزة',
      style: { fontWeight: 'bold', color: '#717171' },
    },
    {
      field: 'app_versions_formatted',
      header: 'إصدارات التطبيق',
      style: { fontWeight: 'bold', color: '#717171' },
      render: (row: User) => row.app_versions_formatted || '-',
    },
    {
      field: 'activity_status_label',
      header: 'النشاط',
      style: { fontWeight: 'bold' },
      render: (row: User) => row.activity_status_label || '-',
    },
    { field: 'status', header: 'حالة الحساب', style: { fontWeight: 'bold' } },
    {
      field: 'roles',
      header: 'الأدوار',
      style: { fontWeight: 'bold', color: '#B34E0A' },
      render: (row: User) => row.roles?.join(', ') || '-',
    },
    { field: 'archive_actions', header: '' },
  ];

  users: User[] = [];
  totalUsers = 0;

  ngOnInit(): void {
    // Pick up ?search=... whenever it changes (including repeated navigations
    // from the header to the same page with a different email/name)
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.searchTerm = params.get('search') ?? '';
      this.selectedType = this.getUserType(params.get('type'));
      this.currentPage = 1;
      this.onGetUsers(1, this.searchTerm);
    });
  }

  onGetUsers(page: number = 1, search: string = this.searchTerm) {
    this.isLoading = true;
    this.usersService
      .getUsers(page, this.rowsPerPage, search, this.selectedType)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.users = res.data.map((user) => ({
            ...user,
            status: user.account_status,
          }));
          this.totalUsers = res.pagination.total;
          this.rowsPerPage = res.pagination.per_page;
          this.currentPage = res.pagination.current_page;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error fetching data:', err);
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  onPageChange(page: number): void {
    this.onGetUsers(page, this.searchTerm);
  }

  onTypeChange(type: UserAppType): void {
    if (this.selectedType === type) {
      return;
    }

    this.selectedType = type;
    this.currentPage = 1;
    this.updateQueryParams({ type });
  }

  // NEW: manual search box typing on this page itself (separate from the header search)
  onSearchInput(value: string): void {
    this.searchTerm = value;
    this.currentPage = 1;
    this.updateSearchQueryParam(value);
  }

  // NEW: clear button handler — wipes the filter and the URL query param
  onClearSearch(): void {
    this.searchTerm = '';
    this.currentPage = 1;
    this.updateSearchQueryParam('');
  }

  private updateSearchQueryParam(search: string): void {
    this.updateQueryParams({ search: search || null });
  }

  private updateQueryParams(queryParams: { search?: string | null; type?: UserAppType }): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge',
    });
    // Note: this.onGetUsers is triggered by the queryParamMap subscription above,
    // so we don't call it again here — avoids a double request.
  }

  private getUserType(type: string | null): UserAppType {
    return type === 'employee_app' ? 'employee_app' : 'admin_app';
  }

  onArchiveUser(user: User): void {
    this.usersService.archiveUser(user.id).subscribe({
      next: () => this.onGetUsers(this.currentPage, this.searchTerm),
      error: (err) => console.error('Failed to archive user:', err),
    });
  }
}
