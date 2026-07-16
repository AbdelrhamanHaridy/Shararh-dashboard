import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-accounts-and-permissions',
  imports: [PageHeaderComponent],
  templateUrl: './accounts-and-permissions.html',
  styleUrl: './accounts-and-permissions.scss',
})
export class AccountsAndPermissions {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };

  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'الحسابات والصلاحيات', routerLink: '/accounts-and-permissions' },
  ];
  constructor(private router: Router) {}

  navigateToAddNewAccount() {
    this.router.navigate(['/more/accounts-and-permissions/add-new-account']);
  }
}
