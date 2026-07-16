import { Component, inject } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-accounts-receivable',
  imports: [PageHeaderComponent, SharedTableComponent],
  templateUrl: './accounts-receivable.html',
  styleUrl: './accounts-receivable.scss',
})
export class AccountsReceivable {
  private router = inject(Router);

  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };

  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'حسابات المديونيات', routerLink: '/more/accounts-receivable' },
  ];

  onAddUser(): void {
    this.router.navigate(['/user-database/add-new-user/add-merchant-for-first-time']);
  }
  columns = [
    { field: 'amount', header: 'المبلغ' },
    { field: 'account', header: 'اسم الحساب' },
    { field: '', header: '' },
  ];

  users = [
    {
      amount: 5000,
      account: 'حساب احمد محمد',
    },
    {
      amount: 5000,
      account: 'حساب احمد محمد',
    },
    {
      amount: 5000,
      account: 'حساب احمد محمد',
    },
    {
      amount: 5000,
      account: 'حساب احمد محمد',
    },
    {
      amount: 5000,
      account: 'حساب احمد محمد',
    },
    {
      amount: 5000,
      account: 'حساب احمد محمد',
    },
  
  ];
  totalUsers = this.users.length;
}
