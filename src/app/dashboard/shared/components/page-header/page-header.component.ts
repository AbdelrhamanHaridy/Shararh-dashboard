import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { DatePickerModule } from 'primeng/datepicker';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule, DatePickerModule, FormsModule],
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

  /** Whether to show date range filters */
  @Input() showDateFilters: boolean = false;

  /** Start date value */
  @Input() dateFromValue: Date | null = null;

  /** End date value */
  @Input() dateToValue: Date | null = null;

  /** Emitted when the action button is clicked */
  @Output() actionButtonClick = new EventEmitter<MouseEvent>();

  /** Emitted when date from changes */
  @Output() dateFromChange = new EventEmitter<Date | null>();

  /** Emitted when date to changes */
  @Output() dateToChange = new EventEmitter<Date | null>();

  /** Emitted when the user clicks the small reset button to clear both dates */
  @Output() dateReset = new EventEmitter<void>();

  onActionClick(event: MouseEvent): void {
    this.actionButtonClick.emit(event);
  }

  onDateFromChange(date: Date | null): void {
    this.dateFromValue = date;
    this.dateFromChange.emit(date);
  }

  onDateToChange(date: Date | null): void {
    this.dateToValue = date;
    this.dateToChange.emit(date);
  }

  onResetDates(): void {
    this.dateFromValue = null;
    this.dateToValue = null;
    this.dateFromChange.emit(null);
    this.dateToChange.emit(null);
    this.dateReset.emit();
  }
}
