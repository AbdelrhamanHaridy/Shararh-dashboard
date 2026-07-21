import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { RoleBadgeDirective } from '../../directives/role-badge.directive';
import { StatusBadgeDirective } from '../../directives/status.directive';

@Component({
  selector: 'app-child-table',
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    RoleBadgeDirective,
    StatusBadgeDirective,
  ],
  templateUrl: './child-table.component.html',
  styleUrl: './child-table.component.scss',
})
export class ChildTableComponent {
  @Input() tableData: any[] = [];
  @Input() columns: any[] = [];
  @Input() itemLabel: string = 'items';
  @Input() title?: string;
  @Input() showAllButton: boolean = false;
  @Input() showAllButtonLabel: string = 'Show All';

  @Output() actionClick: EventEmitter<{ action: string; row: any }> = new EventEmitter();
  @Output() showAll: EventEmitter<void> = new EventEmitter();

  onActionClick(action: string, row: any) {
    this.actionClick.emit({ action, row });
  }

  onShowAll() {
    this.showAll.emit();
  }
}
