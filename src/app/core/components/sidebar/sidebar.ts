import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

interface NavChild {
  label: string;
  route: string;
}

interface NavItem {
  label: string;
  icon: string; // icon asset file name
  active?: boolean;
  route?: string; // leaf item
  children?: NavChild[]; // group item
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss'],
})
export class Sidebar {
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
    // { label: 'الارشيف', icon: 'icon-11.svg', route: '/archive' },
    {
      icon: 'icon-11.svg',
      label: 'الارشيف',
      children: [
        { label: 'ارشيف العملاء المحتملون', route: '/archive/potential-customer-center' },
        { label: 'ارشيف الجلسات', route: '/archive/sessions' },
        { label: 'ارشيف المستخدمين', route: '/archive/users' },
      ],
    },
    { label: 'المزيد', icon: 'icon-12.svg', route: '/more' },
    { label: 'إعدادات', icon: 'icon-13.svg', route: '/settings' },
  ];

  openGroups = new Set<NavItem>();

  private sub?: Subscription;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.syncOpenGroups();
    this.sub = this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => this.syncOpenGroups());
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  private syncOpenGroups(): void {
    this.navItems.forEach((item) => {
      if (item.children && this.hasActiveChild(item)) {
        this.openGroups.add(item);
      }
    });
  }

  toggle(item: NavItem): void {
    this.openGroups.has(item) ? this.openGroups.delete(item) : this.openGroups.add(item);
  }

  isOpen(item: NavItem): boolean {
    return this.openGroups.has(item);
  }

  hasActiveChild(item: NavItem): boolean {
    return !!item.children?.some((c) =>
      this.router.isActive(c.route, {
        paths: 'subset',
        queryParams: 'ignored',
        fragment: 'ignored',
        matrixParams: 'ignored',
      }),
    );
  }
}
