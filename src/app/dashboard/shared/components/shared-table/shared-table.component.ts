import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';
import { Menu, MenuModule } from 'primeng/menu';
import { RoleBadgeDirective } from '../../directives/role-badge.directive';
import { StatusBadgeDirective } from '../../directives/status.directive';
import { RatingBadgeDirective } from '../../directives/rating-badge.directive';
import { ProcessStatusBadgeDirective } from '../../directives/proccess-status-badge.directive';
import { CouponStatusBadgeDirective } from '../../directives/coupon-status-badge.directive';
@Component({
  selector: 'app-shared-table',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    PaginatorModule,
    ButtonModule,
    CheckboxModule,
    SkeletonModule,
    MenuModule,
    RoleBadgeDirective,
    StatusBadgeDirective,
    RatingBadgeDirective,
    ProcessStatusBadgeDirective,
    CouponStatusBadgeDirective,
  ],
  templateUrl: './shared-table.component.html',
  styleUrl: './shared-table.component.scss',
})
export class SharedTableComponent {
  @Input() tableData: any[] = [];
  @Input() columns: any[] = [];
  @Input() rowsPerPage: number = 10;
  @Input() totalRecords: number = 0;
  @Input() itemLabel: string = 'items';
  @Input() isLoading: boolean = false;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() rowClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() actionClick: EventEmitter<{ action: string; row: any }> = new EventEmitter();

  currentFirst: number = 0;

  get showingCount(): number {
    return Math.min(this.currentFirst + this.rowsPerPage, this.totalRecords);
  }

  onPageChange(event: any) {
    this.currentFirst = event.first;
    this.pageChange.emit(event.page + 1);
  }

  onActionClick(action: string, row: any) {
    this.actionClick.emit({ action, row });
  }

  onRowClick(row: any) {
    this.rowClick.emit(row);
  }

  getColumnStyle(col: any): any {
    return col.style || {};
  }

  getCellStyle(col: any, row: any): any {
    if (col.style) {
      return col.style;
    }
    return {};
  }

  // Set the menu's model imperatively, right before opening it —
  // NOT via a reactive [model] binding, which was rebuilding the
  // overlay on every CD cycle and eating the first click.
  onCouponMenuClick(menu: Menu, row: any, event: Event) {
    event.stopPropagation();
    menu.model = this.getContextMenu(row);
    menu.toggle(event);
  }

  onArchiveMenuClick(menu: Menu, row: any, event: Event) {
    event.stopPropagation();
    menu.model = [
      {
        label: 'أرشفة',
        command: () => this.actionClick.emit({ action: 'archive', row }),
      },
    ];
    menu.toggle(event);
  }

  onSessionMenuClick(menu: Menu, row: any, event: Event) {
    event.stopPropagation();
    menu.model = [
      {
        label: 'عرض تفاصيل الجلسه',
        command: () => this.actionClick.emit({ action: 'viewSession', row }),
      },
      {
        label: 'أرشفة الجلسه',
        command: () => this.actionClick.emit({ action: 'archiveSession', row }),
      },
    ];
    menu.toggle(event);
  }

  getContextMenu(row: any): any[] {
    const isActive = row.coupon_status === 'active';

    return [
      {
        label: 'تعديل الكوبون',
        command: () => this.actionClick.emit({ action: 'edit', row }),
      },
      {
        label: 'تعديل العملاء المستهدفين',
        command: () => this.actionClick.emit({ action: 'editTargetCustomers', row }),
      },
      {
        label: 'تعيين مسئول',
        command: () => this.actionClick.emit({ action: 'assignManager', row }),
      },
      {
        label: isActive ? 'ايقاف الكوبون' : 'تنشيط الكوبون',
        style: { color: isActive ? '#DC2626' : '#16A34A' },
        command: () => this.actionClick.emit({ action: 'toggleStatus', row }),
      },
    ];
  }
}
