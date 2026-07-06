import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs/operators';

interface NavItem {
  label: string;
  icon: string; // svg path key
  route?: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private readonly router = inject(Router);

  navItems: NavItem[] = [
    { label: 'لوحة التحكم', icon: 'home', route: '/home' },
    { label: 'قاعدة بيانات المستخدمين', icon: 'users', route: '/user-database' },
    { label: 'إدارة الاشتراكات', icon: 'card', route: '/subscription-management' },
    { label: 'مركز العملاء المحتملين', icon: 'user-plus', route: '' },
    { label: 'سجل الاتصال', icon: 'phone', route: '' },
    { label: 'لوحة التقدم', icon: 'zap', route: '' },
    { label: 'إدارة النسخ والتحديثات', icon: 'shield', route: '' },
    { label: 'الاشعارات', icon: 'bell', route: '' },
    { label: 'الشكاوي والاقتراحات', icon: 'chat', route: '' },
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
