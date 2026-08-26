import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItem, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule, Menu } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../shared/services/base.component';
import { AccountsAndPermissionsService } from './services/accounts-and-permissions.service';
import { Employee } from './models/accounts-and-permissions-add-new-account.model';

@Component({
  selector: 'app-accounts-and-permissions',
  imports: [PageHeaderComponent, CommonModule, ConfirmDialogModule, MenuModule, DialogModule],
  providers: [ConfirmationService],
  templateUrl: './accounts-and-permissions.html',
  styleUrl: './accounts-and-permissions.scss',
})
export class AccountsAndPermissions extends BaseComponent implements OnInit {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/home' };

  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'الحسابات والصلاحيات', routerLink: '/accounts-and-permissions' },
  ];

  employees: Employee[] = [];
  isLoading = false;
  errorMessage = '';

  showDetailsDialog = false;
  selectedEmployee: Employee | null = null;
  isLoadingDetails = false;

  constructor(
    private router: Router,
    private accountsService: AccountsAndPermissionsService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    this.onGetEmployees();
  }

  onGetEmployees() {
    this.isLoading = true;
    this.errorMessage = '';

    this.accountsService
      .getEmployees()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.employees = res.data ?? [];
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching employees:', err);
          this.errorMessage = 'حدث خطأ أثناء تحميل الحسابات';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  trackByEmployeeId(_index: number, employee: Employee): number {
    return employee.id;
  }

  permissionsModeLabel(mode: string): string {
    return mode === 'full_access' ? 'صلاحيات كاملة' : 'صلاحيات محدودة';
  }

  getContextMenu(employee: Employee): MenuItem[] {
    return [
      // {
      //   label: 'عرض التفاصيل',
      //   command: () => this.onViewDetails(employee),
      // },
      {
        label: 'حذف الحساب',
        style: { color: '#DC2626' },
        command: () => this.onDelete(employee),
      },
    ];
  }

  onMenuClick(menu: Menu, employee: Employee, event: Event) {
    event.stopPropagation();
    menu.model = this.getContextMenu(employee);
    menu.toggle(event);
  }

  onViewDetails(employee: Employee) {
    this.isLoadingDetails = true;
    this.showDetailsDialog = true;
    this.selectedEmployee = null;

    this.accountsService
      .getEmployeeById(employee.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.selectedEmployee = res.data;
          this.isLoadingDetails = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching employee details:', err);
          this.isLoadingDetails = false;
          this.showDetailsDialog = false;
          this.cdr.detectChanges();
        },
      });
  }

  onDelete(employee: Employee) {
    this.confirmationService.confirm({
      message: `هل أنت متأكد من حذف حساب "${employee.full_name}"؟`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'حذف',
      rejectLabel: 'إلغاء',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.accountsService
          .deleteEmployee(employee.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.employees = this.employees.filter((e) => e.id !== employee.id);
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Error deleting employee:', err);
            },
          });
      },
    });
  }

  navigateToAddNewAccount() {
    this.router.navigate(['/more/accounts-and-permissions/add-new-account']);
  }
}
