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
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { BaseComponent } from '../../shared/services/base.component';
import { Observable, takeUntil } from 'rxjs';
import { UserDatabaseService } from './services/user-database.service';
import { User, UserAppType } from './models/user-database.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-user-database',
  imports: [
    SharedKpiCard,
    SharedTableComponent,
    PageHeaderComponent,
    CommonModule,
    FormsModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './user-database.html',
  styleUrl: './user-database.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDatabase extends BaseComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private usersService = inject(UserDatabaseService);
  private cdr = inject(ChangeDetectorRef);
  private confirmationService = inject(ConfirmationService);
  private messageService = inject(MessageService);

  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/home' };
  breadcrumbItems: MenuItem[] = [{ label: 'قاعدة بيانات المستخدمين', routerLink: '/users' }];

  isLoading: boolean = true;
  searchTerm: string = '';
  selectedType: UserAppType = 'admin_app';
  currentPage: number = 1;
  rowsPerPage: number = 10;

  // ---------- User actions state ----------
  selectedUser: User | null = null;
  isActionLoading = false;

  // Notification dialog
  notificationDialogVisible = false;
  notificationTitle = '';
  notificationBody = '';

  // Reset password dialog
  resetPasswordDialogVisible = false;
  newPassword = '';
  generatedPassword: string | null = null;

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
    { field: 'users_actions', header: '' },
  ];

  users: User[] = [];
  totalUsers = 0;

  ngOnInit(): void {
    // Pick up ?search=...&type=... whenever they change
    this.route.queryParamMap.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.searchTerm = params.get('search') ?? '';
      this.selectedType = this.getUserType(params.get('type'));
      this.currentPage = 1;
      this.onGetUsers(1, this.searchTerm);
    });
  }

  onAddUser(): void {
    this.router.navigate(['/user-database/add-new-user/add-merchant-for-first-time']);
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

  onSearchInput(value: string): void {
    this.searchTerm = value;
    this.currentPage = 1;
    this.updateSearchQueryParam(value);
  }

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
    // onGetUsers is triggered by the queryParamMap subscription in ngOnInit,
    // so we don't call it again here (avoids a double request).
  }

  private getUserType(type: string | null): UserAppType {
    return type === 'employee_app' ? 'employee_app' : 'admin_app';
  }

  // ======================================================
  // User actions (dispatcher for the shared table's actionClick)
  // ======================================================
  onTableAction(e: { action: string; row: User }): void {
    this.selectedUser = e.row;

    switch (e.action) {
      case 'sendNotification':
        this.openNotificationDialog();
        break;
      case 'resetPassword':
        this.openResetPasswordDialog();
        break;
      case 'toggleAccountStatus':
        this.confirmToggleStatus();
        break;
      case 'logoutDevices':
        this.confirmLogoutDevices();
        break;
      case 'archiveUser':
        this.confirmArchive();
        break;
    }
  }

  // ---------- Send notification (dialog) ----------
  openNotificationDialog(): void {
    this.notificationTitle = '';
    this.notificationBody = '';
    this.notificationDialogVisible = true;
    this.cdr.markForCheck();
  }

  submitNotification(): void {
    if (!this.selectedUser || !this.notificationTitle.trim() || !this.notificationBody.trim()) {
      return;
    }

    this.isActionLoading = true;
    this.usersService
      .sendNotification(
        this.selectedUser.id,
        this.notificationTitle.trim(),
        this.notificationBody.trim(),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isActionLoading = false;
          this.notificationDialogVisible = false;
          this.showSuccess('تم إرسال الإشعار بنجاح');
          this.cdr.markForCheck();
        },
        error: (err) => this.handleError(err, 'فشل إرسال الإشعار'),
      });
  }

  // ---------- Reset password (dialog) ----------
  openResetPasswordDialog(): void {
    this.newPassword = '';
    this.generatedPassword = null;
    this.resetPasswordDialogVisible = true;
    this.cdr.markForCheck();
  }

  submitResetPassword(): void {
    if (!this.selectedUser) return;

    this.isActionLoading = true;
    this.usersService
      .resetPassword(this.selectedUser.id, this.newPassword.trim() || undefined)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isActionLoading = false;
          // Adjust to your real response shape
          this.generatedPassword = res?.data?.password ?? res?.password ?? null;

          if (this.generatedPassword) {
            // Keep dialog open so the admin can copy the generated password
            this.showSuccess('تم توليد كلمة مرور جديدة');
          } else {
            this.resetPasswordDialogVisible = false;
            this.showSuccess('تم تغيير كلمة المرور بنجاح');
          }
          this.cdr.markForCheck();
        },
        error: (err) => this.handleError(err, 'فشل إعادة تعيين كلمة المرور'),
      });
  }

  copyGeneratedPassword(): void {
    if (this.generatedPassword) {
      navigator.clipboard.writeText(this.generatedPassword);
      this.showSuccess('تم النسخ');
    }
  }

  // ---------- Activate / Suspend (confirm) ----------
  confirmToggleStatus(): void {
    const user = this.selectedUser;
    if (!user) return;
    const willSuspend = user.account_status !== 'suspended';

    this.confirmationService.confirm({
      header: willSuspend ? 'إيقاف الحساب' : 'تفعيل الحساب',
      message: willSuspend
        ? `هل أنت متأكد من إيقاف حساب "${user.full_name}"؟`
        : `هل أنت متأكد من تفعيل حساب "${user.full_name}"؟`,
      icon: willSuspend ? 'pi pi-exclamation-triangle' : 'pi pi-question-circle',
      acceptLabel: 'تأكيد',
      rejectLabel: 'إلغاء',
      acceptButtonProps: { severity: willSuspend ? 'danger' : 'success' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () =>
        this.runAction(
          this.usersService.updateAccountStatus(user.id, willSuspend ? 'suspended' : 'active'),
          willSuspend ? 'تم إيقاف الحساب' : 'تم تفعيل الحساب',
          true,
        ),
    });
  }

  // ---------- Force logout (confirm) ----------
  confirmLogoutDevices(): void {
    const user = this.selectedUser;
    if (!user) return;

    this.confirmationService.confirm({
      header: 'تسجيل الخروج من كل الأجهزة',
      message: `سيتم تسجيل خروج "${user.full_name}" من جميع الأجهزة. هل تريد المتابعة؟`,
      icon: 'pi pi-sign-out',
      acceptLabel: 'تأكيد',
      rejectLabel: 'إلغاء',
      acceptButtonProps: { severity: 'warn' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () =>
        this.runAction(this.usersService.logoutDevices(user.id), 'تم تسجيل الخروج من جميع الأجهزة'),
    });
  }

  // ---------- Archive (confirm) ----------
  confirmArchive(): void {
    const user = this.selectedUser;
    if (!user) return;

    this.confirmationService.confirm({
      header: 'أرشفة المستخدم',
      message: `هل أنت متأكد من أرشفة "${user.full_name}"؟`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'أرشفة',
      rejectLabel: 'إلغاء',
      acceptButtonProps: { severity: 'danger' },
      rejectButtonProps: { severity: 'secondary', outlined: true },
      accept: () =>
        this.runAction(this.usersService.archiveUser(user.id), 'تمت أرشفة المستخدم', true),
    });
  }

  // ---------- Helpers ----------
  private runAction(request$: Observable<any>, successMsg: string, reload = false): void {
    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.showSuccess(successMsg);
        if (reload) this.onGetUsers(this.currentPage, this.searchTerm);
        this.cdr.markForCheck();
      },
      error: (err) => this.handleError(err, 'حدث خطأ أثناء تنفيذ العملية'),
    });
  }

  private showSuccess(detail: string): void {
    this.messageService.add({ severity: 'success', summary: 'تم', detail, life: 3000 });
  }

  private handleError(err: any, fallback: string): void {
    console.error(fallback, err);
    this.isActionLoading = false;
    this.messageService.add({
      severity: 'error',
      summary: 'خطأ',
      detail: err?.error?.message || fallback,
      life: 4000,
    });
    this.cdr.markForCheck();
  }
}