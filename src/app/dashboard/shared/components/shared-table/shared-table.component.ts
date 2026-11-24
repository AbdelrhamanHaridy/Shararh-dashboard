// shared-table.component.ts
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';
import { RoleBadgeDirective } from '../../directives/role-badge.directive';
import { StatusBadgeDirective } from '../../directives/status.directive';
import { RatingBadgeDirective } from '../../directives/rating-badge.directive';
import { ProcessStatusBadgeDirective } from '../../directives/proccess-status-badge.directive';
import { CouponStatusBadgeDirective } from '../../directives/coupon-status-badge.directive';
import { MenuTriggerDirective } from '../../directives/menu-trigger.directive';
import { ContextMenuItem } from '../../services/context-menu.service';
import { User } from '../../../pages/user-database/models/user-database.model';

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
    RoleBadgeDirective,
    StatusBadgeDirective,
    RatingBadgeDirective,
    ProcessStatusBadgeDirective,
    CouponStatusBadgeDirective,
    MenuTriggerDirective,
  ],
  templateUrl: './shared-table.component.html',
  styleUrl: './shared-table.component.scss',
})
export class SharedTableComponent implements OnChanges {
  @Input() tableData: any[] = [];
  @Input() columns: any[] = [];
  @Input() rowsPerPage: number = 10;
  @Input() totalRecords: number = 0;
  @Input() currentPage: number = 1;
  @Input() itemLabel: string = 'items';
  @Input() isLoading: boolean = false;
  @Input() activeSearchTerm: string = '';
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() rowClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() actionClick: EventEmitter<{ action: string; row: any }> = new EventEmitter();
  @Output() clearSearch: EventEmitter<void> = new EventEmitter<void>();

  currentFirst: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentPage'] || changes['rowsPerPage']) {
      this.currentFirst = (this.currentPage - 1) * this.rowsPerPage;
    }
  }

  onPageChange(event: any) {
    this.currentFirst = event.first;
    this.pageChange.emit(event.page + 1);
  }

  get showingCount(): number {
    return Math.min(this.currentFirst + this.rowsPerPage, this.totalRecords);
  }

  onClearSearchClick(): void {
    this.clearSearch.emit();
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

  // These just build data now — no open/close state, no positioning,
  // no ViewChild refs. All of that lives in the directive + service.
  getSessionMenuItems(row: any): ContextMenuItem[] {
    return [
      {
        label: 'عرض تفاصيل الجلسه',
        command: () => this.actionClick.emit({ action: 'viewSession', row }),
      },
      {
        label: 'أرشفة الجلسه',
        command: () => this.actionClick.emit({ action: 'archiveSession', row }),
      },
    ];
  }
  getUsersMenuItems(row: User): ContextMenuItem[] {
    return [
      {
        label: 'إرسال اشعار مباشر',
        // color: '#2563EB', // Blue
        command: () => this.actionClick.emit({ action: 'sendNotification', row }),
      },
      {
        label: 'إعادة تعيين كلمة المرور',
        // color: '#9333EA', // Purple
        command: () => this.actionClick.emit({ action: 'resetPassword', row }),
      },
      {
        label: 'إيقاف الحساب مؤقتاََ',
        color: '#137FEC',
        command: () => this.actionClick.emit({ action: 'toggleAccountStatus', row }),
      },
      {
        label: 'تسجيل الخروج من الاجهزه',
        color: '#D22F27', // Gray
        command: () => this.actionClick.emit({ action: 'logoutDevices', row }),
      },
      {
        label: 'أرشفة المستخدم',
        color: '#D22F27', // Red
        command: () => this.actionClick.emit({ action: 'archiveUser', row }),
      },
    ];
  }
  getArchiveMenuItems(row: any): ContextMenuItem[] {
    return [{ label: 'أرشفة', command: () => this.actionClick.emit({ action: 'archive', row }) }];
  }

  getCouponMenuItems(row: any): ContextMenuItem[] {
    const isActive = row.coupon_status === 'active';
    return [
      { label: 'تعديل الكوبون', command: () => this.actionClick.emit({ action: 'edit', row }) },
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
        color: isActive ? '#DC2626' : '#16A34A',
        command: () => this.actionClick.emit({ action: 'toggleStatus', row }),
      },
    ];
  }
}
