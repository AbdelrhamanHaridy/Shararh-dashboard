import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs/operators';

interface NavItem {
  label: string;
  icon: string; // icon asset file name
  route?: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
  private readonly router = inject(Router);

  navItems: NavItem[] = [
    { label: 'لوحة التحكم', icon: 'icon.svg', route: '/home' },
    { label: 'قاعدة بيانات المستخدمين', icon: 'icon-1.svg', route: '/user-database' },
    { label: 'إدارة الاشتراكات', icon: 'icon-2.svg', route: '/subscription-management' },
    { label: 'مركز العملاء المحتملين', icon: 'icon-3.svg', route: '/potential-customer-center' },
    { label: 'سجل الاتصال', icon: 'icon-4.svg', route: '/contact-log' },
    { label: 'لوحة التقدم', icon: 'icon-5.svg', route: '/progress-board' },
    { label: 'إدارة النسخ والتحديثات', icon: 'icon-6.svg', route: '/version-control-and-updates' },
    { label: 'الاشعارات', icon: 'icon-7.svg', route: '/notifications' },
    { label: 'الشكاوي والاقتراحات', icon: 'icon-8.svg', route: '/complaints-and-suggestions' },
    { label: 'الاسئله الشائعه', icon: 'icon-9.svg', route: '/frequently-asked-questions' },
    { label: 'الجلسات', icon: 'icon-10.svg', route: '/sessions' },
    { label: 'الارشيف', icon: 'icon-11.svg', route: '/archive' },
    { label: 'المزيد', icon: 'icon-12.svg', route: '/more' },
    { label: 'إعدادات', icon: 'icon-13.svg', route: '/settings' },
  ];

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateActiveItem(event.urlAfterRedirects));

    this.updateActiveItem(this.router.url);
  }

  private updateActiveItem(url: string): void {
    this.navItems = this.navItems.map((item) => ({
      ...item,
      active: item.route ? url === item.route || url.startsWith(`${item.route}/`) : false,
    }));
  }
}
