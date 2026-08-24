import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { takeUntil } from 'rxjs';
import { DebtTransactionDialog } from './components/debt-transaction-dialog/debt-transaction-dialog';
import { DebtTransactionDetailsDialog } from './components/debt-transaction-details-dialog/debt-transaction-details-dialog';
import { BaseComponent } from '../../../../shared/services/base.component';
import { DebtTransactionsService } from './services/debt-transactions.service';
import { DebtTransactionUser } from './models/debt-transaction.model';

@Component({
  selector: 'app-accounts-receivable',
  imports: [CommonModule, PageHeaderComponent, SharedTableComponent, DynamicDialogModule],
  providers: [DialogService],
  templateUrl: './accounts-receivable.html',
  styleUrl: './accounts-receivable.scss',
})
export class AccountsReceivable extends BaseComponent {
  private router = inject(Router);
  private debtTransactionsService = inject(DebtTransactionsService);

  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/home' };

  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'حسابات المديونيات', routerLink: '/more/accounts-receivable' },
  ];

  users = signal<DebtTransactionUser[]>([]);
  totalUsers = signal<number>(0);
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  search = signal('');
  private searchTimer?: ReturnType<typeof setTimeout>;

  constructor(private dialogService: DialogService) {
    super();
  }

  ngOnInit(): void {
    this.loadDebtTransactions();
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.search.set(input.value);

    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      this.loadDebtTransactions();
    }, 400);
  }

  private loadDebtTransactions(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.debtTransactionsService
      .getDebtTransactions(this.search())
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.users.set(response.data);
            this.totalUsers.set(response.pagination?.total || response.data.length);
          }
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Failed to load debt transactions:', error);
          this.error.set('Failed to load debt transactions');
          this.isLoading.set(false);
        },
      });
  }

  onAddUser(): void {
    this.router.navigate(['/user-database/add-new-user/add-merchant-for-first-time']);
  }

  columns = [
    { field: 'current_balance', header: 'الرصيد الحالي' },
    { field: 'full_name', header: 'اسم الحساب', style: { fontSize: '16px', color: '#1A1C18' } },
    { field: 'paymentActions', header: '' },
  ];

  onTableActionClick(event: { action: string; row: any }) {
    if (event.action === 'add') {
      this.openDebtTransactionDialog('add', event.row);
    } else if (event.action === 'payment') {
      this.openDebtTransactionDialog('payment', event.row);
    } else if (event.action === 'details') {
      this.openTransactionDetailsDialog(event.row);
    }
  }

  private openDebtTransactionDialog(mode: 'add' | 'payment', row: DebtTransactionUser) {
    const ref = this.dialogService.open(DebtTransactionDialog, {
      width: '420px',
      header: mode === 'add' ? 'إضافة معاملة' : 'سداد معاملة',
      modal: true,
      closable: true,
      data: {
        mode,
        userId: row.id,
        accountName: row.full_name,
      },
    });

    if (ref) {
      ref.onClose.pipe(takeUntil(this.destroy$)).subscribe((result) => {
        if (result) {
          // Refresh the list after transaction
          this.loadDebtTransactions();
        }
      });
    }
  }

  private openTransactionDetailsDialog(row: DebtTransactionUser) {
    const ref = this.dialogService.open(DebtTransactionDetailsDialog, {
      showHeader: false,
      width: '750px',
      modal: true,
      closable: true,
      data: {
        userId: row.id,
        accountName: row.full_name,
      },
    });

    if (ref) {
      ref.onClose.pipe(takeUntil(this.destroy$)).subscribe();
    }
  }
}
