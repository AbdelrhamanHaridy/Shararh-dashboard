import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-notifications',
  imports: [PageHeaderComponent],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
})
export class Notifications {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };
  breadcrumbItems: MenuItem[] = [
    { label: 'الإشعارات', routerLink: '/notifications' },
  ];
}
