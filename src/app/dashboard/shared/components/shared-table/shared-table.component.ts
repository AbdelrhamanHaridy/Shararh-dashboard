import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { RoleBadgeDirective } from '../../directives/role-badge.directive';
import { StatusBadgeDirective } from '../../directives/status.directive';
import { RatingBadgeDirective } from '../../directives/rating-badge.directive';
import { ProcessStatusBadgeDirective } from '../../directives/proccess-status-badge.directive';
@Component({
  selector: 'app-shared-table',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    PaginatorModule,
    ButtonModule,
    CheckboxModule,
    RoleBadgeDirective,
    StatusBadgeDirective,
    RatingBadgeDirective,
    ProcessStatusBadgeDirective,
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
    // If column has custom style
    if (col.style) {
      return col.style;
    }

    // // Or you can add conditional styling based on the value
    // if (col.field === 'activity') {
    //   return {
    //     color: row[col.field] === 'نشط' ? '#27AE60' : '#E74C3C',
    //     fontWeight: '600',
    //   };
    // }

    return {};
  }
}
