import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SkeletonModule } from 'primeng/skeleton';
import { FormsModule } from '@angular/forms';
import { Menu, MenuModule } from 'primeng/menu';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
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
export class SharedTableComponent implements OnInit, OnDestroy {
  @Input() tableData: any[] = [];
  @Input() columns: any[] = [];
  @Input() rowsPerPage: number = 10;
  @Input() totalRecords: number = 0;
  @Input() currentPage: number = 1;   // NEW
  @Input() itemLabel: string = 'items';
  @Input() isLoading: boolean = false;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() rowClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() actionClick: EventEmitter<{ action: string; row: any }> = new EventEmitter();

  // Single shared menu instances, one per menu "type", reused across all rows.
  @ViewChild('sessionMenu') sessionMenu!: Menu;
  @ViewChild('archiveMenu') archiveMenu!: Menu;
  @ViewChild('couponMenu') couponMenu!: Menu;

  currentFirst: number = 0;

  private routerSub?: Subscription;

  constructor(private readonly router: Router) {}

  ngOnInit(): void {
    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.closeAllMenus();
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    // Keep the paginator's visual "first" in sync whenever the parent
    // tells us which page we're actually on (API is source of truth).
    if (changes['currentPage'] || changes['rowsPerPage']) {
      this.currentFirst = (this.currentPage - 1) * this.rowsPerPage;
    }
  }

  onPageChange(event: any) {
    this.currentFirst = event.first;
    this.pageChange.emit(event.page + 1); // PrimeNG page is 0-indexed
  }
  ngOnDestroy(): void {
    // Belt-and-suspenders: also close on component destroy, in case this
    // component is removed without a route change (e.g. *ngIf toggling
    // it off, a dialog closing, etc.).
    this.closeAllMenus();
    this.routerSub?.unsubscribe();
  }

  private closeAllMenus(): void {
    this.sessionMenu?.hide();
    this.archiveMenu?.hide();
    this.couponMenu?.hide();
  }

  get showingCount(): number {
    return Math.min(this.currentFirst + this.rowsPerPage, this.totalRecords);
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
  //
  // Each of these now targets the SAME shared p-menu instance (declared once,
  // outside the row loop) instead of a fresh instance per row. That's what
  // fixes the "infinite menus" bug: previously every row rendered its own
  // <p-menu appendTo="body">, so re-renders of the table (pagination, data
  // refresh, isLoading toggling, etc.) could recreate row menu components
  // while an old one was still open, leaving orphaned overlays stacking up
  // in <body> instead of a single instance simply toggling open/closed.
  onCouponMenuClick(row: any, event: Event) {
    event.stopPropagation();
    this.couponMenu.model = this.getContextMenu(row);
    this.couponMenu.toggle(event);
  }

  onArchiveMenuClick(row: any, event: Event) {
    event.stopPropagation();
    this.archiveMenu.model = [
      {
        label: 'أرشفة',
        command: () => this.actionClick.emit({ action: 'archive', row }),
      },
    ];
    this.archiveMenu.toggle(event);
  }

  onSessionMenuClick(row: any, event: Event) {
    event.stopPropagation();
    this.sessionMenu.model = [
      {
        label: 'عرض تفاصيل الجلسه',
        command: () => this.actionClick.emit({ action: 'viewSession', row }),
      },
      {
        label: 'أرشفة الجلسه',
        command: () => this.actionClick.emit({ action: 'archiveSession', row }),
      },
    ];
    this.sessionMenu.toggle(event);
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
