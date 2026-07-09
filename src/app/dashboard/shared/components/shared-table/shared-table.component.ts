import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-shared-table',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    PaginatorModule,
    ButtonModule,
    CheckboxModule,
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
  @Output() actionClick: EventEmitter<{ action: string; row: any }> =
    new EventEmitter();

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
}
