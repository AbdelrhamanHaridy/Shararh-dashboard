import { Component, inject } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { takeUntil } from 'rxjs';
import { DebtTransactionDialog } from './components/debt-transaction-dialog/debt-transaction-dialog';
import { BaseComponent } from '../../../../shared/services/base.component';

@Component({
  selector: 'app-accounts-receivable',
  imports: [PageHeaderComponent, SharedTableComponent, DynamicDialogModule],
  providers: [DialogService],
  templateUrl: './accounts-receivable.html',
  styleUrl: './accounts-receivable.scss',
})
export class AccountsReceivable extends BaseComponent {
  private router = inject(Router);

  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };

  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'حسابات المديونيات', routerLink: '/more/accounts-receivable' },
  ];

  constructor(private dialogService: DialogService) {
    super();
  }

  onAddUser(): void {
    this.router.navigate(['/user-database/add-new-user/add-merchant-for-first-time']);
  }

  columns = [
    { field: 'amount', header: 'المبلغ' },
    { field: 'account', header: 'اسم الحساب', style: { fontSize: '16px', color: '#1A1C18' } },
    { field: 'paymentActions', header: '' },
  ];

  // NOTE: no GET endpoint was provided for this list — this is still static
  // dummy data. Each row now includes user_id since both debt-transaction
  // endpoints require it. Replace with a real fetch once the endpoint exists.
  users = [
    { user_id: 1, amount: 5000, account: 'حساب احمد محمد' },
    { user_id: 2, amount: 5000, account: 'حساب احمد محمد' },
    { user_id: 3, amount: 5000, account: 'حساب احمد محمد' },
    { user_id: 4, amount: 5000, account: 'حساب احمد محمد' },
    { user_id: 5, amount: 5000, account: 'حساب احمد محمد' },
    { user_id: 6, amount: 5000, account: 'حساب احمد محمد' },
  ];
  totalUsers = this.users.length;

  onTableActionClick(event: { action: string; row: any }) {
    if (event.action === 'add') {
      this.openDebtTransactionDialog('add', event.row);
    } else if (event.action === 'payment') {
      this.openDebtTransactionDialog('payment', event.row);
    }
  }

  private openDebtTransactionDialog(mode: 'add' | 'payment', row: any) {
    const ref = this.dialogService.open(DebtTransactionDialog, {
      showHeader: false,
      width: '420px',
      modal: true,
      closable: true,
      data: {
        mode,
        userId: row.user_id,
        accountName: row.account,
      },
    });

    if (ref) {
      ref.onClose.pipe(takeUntil(this.destroy$)).subscribe((result) => {
        if (result) {
          // No GET endpoint yet to refresh balances from — once available,
          // re-fetch the list here instead of leaving stale amounts.
          console.log('Transaction saved:', result);
        }
      });
    }
  }
}
