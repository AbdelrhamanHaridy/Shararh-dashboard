import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-add-new-user-layout',
  imports: [RouterOutlet, PageHeaderComponent],
  templateUrl: './add-new-user-layout.html',
  styleUrl: './add-new-user-layout.scss',
})
export class AddNewUserLayout {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };

  breadcrumbItems: MenuItem[] = [{ label: 'قاعدة بيانات المستخدمين', routerLink: '/users' }];
}
