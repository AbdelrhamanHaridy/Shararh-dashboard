import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule],
  templateUrl: './page-header.component.html',
})
export class PageHeaderComponent {
  /** Main page title displayed under the breadcrumb, e.g. "قاعدة بيانات المستخدمين" */
  @Input() title: string = '';

  /**
   * Breadcrumb trail items (excluding the root item).
   * Example:
   * [{ label: 'قاعدة بيانات المستخدمين', routerLink: '/users' }]
   */
  @Input() breadcrumbItems: MenuItem[] = [];

  /** Root breadcrumb item, e.g. { label: 'لوحة التحكم', routerLink: '/dashboard' } */
  @Input() home: MenuItem | undefined;

  /** Whether to show the primary action button on the top-left */
  @Input() showActionButton: boolean = false;

  /** Action button label, e.g. "إضافة مستخدم جديد" */
  @Input() actionButtonLabel: string = '';

  /** Emitted when the action button is clicked */
  @Output() actionButtonClick = new EventEmitter<MouseEvent>();

  onActionClick(event: MouseEvent): void {
    this.actionButtonClick.emit(event);
  }
}
