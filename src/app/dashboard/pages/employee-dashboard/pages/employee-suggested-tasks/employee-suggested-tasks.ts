import { ChangeDetectorRef, Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Breadcrumb } from 'primeng/breadcrumb';
import { ProgressBar } from 'primeng/progressbar';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { SkeletonModule } from 'primeng/skeleton';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { SuggestedTask } from '../../models/suggested-tasks.model';
import { SuggestedTasksService } from '../../services/suggested-tasks.service';
import { BaseComponent } from '../../../../shared/services/base.component';
import { takeUntil } from 'rxjs';
import { ContextMenuItem } from '../../../../shared/services/context-menu.service';
import { MenuTriggerDirective } from '../../../../shared/directives/menu-trigger.directive';

@Component({
  selector: 'app-employee-suggested-tasks',
  imports: [
    Breadcrumb,
    ProgressBar,
    CommonModule,
    ConfirmDialogModule,
    TieredMenuModule,
    SkeletonModule,
    MenuTriggerDirective,
  ],
  templateUrl: './employee-suggested-tasks.html',
  styleUrl: './employee-suggested-tasks.scss',
})
export class EmployeeSuggestedTasks extends BaseComponent implements OnInit {
  title = 'المهام المقترحه';
  isLoading = true;

  completedTasks = 0;
  totalTasks = 7;
  @Output() actionClick = new EventEmitter<{
    action: string;
    row: SuggestedTask;
  }>();
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };

  breadcrumbItems: MenuItem[] = [{ label: 'المهام المقترحه' }];
  constructor(
    private suggestedTasksService: SuggestedTasksService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }
  suggested_tasks: SuggestedTask[] = [];
  ngOnInit() {
    this.getSuggestedTasks();
  }
getSuggestedTasks() {
  this.isLoading = true;
  this.cdr.detectChanges();

  this.suggestedTasksService
    .getSuggestedTasks()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (res) => {
        this.suggested_tasks = res.data;
        this.isLoading = false;

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;

        this.cdr.detectChanges();
      },
    });
}

  getSuggestedTaskMenuItems(task: SuggestedTask): ContextMenuItem[] {
    return [
      // {
      //   label: 'عرض تفاصيل المهمة',
      //   command: () =>
      //     this.actionClick.emit({
      //       action: 'viewSuggestedTask',
      //       row: task,
      //     }),
      // },
      // {
      //   label: 'تعديل المهمة',
      //   command: () =>
      //     this.actionClick.emit({
      //       action: 'editSuggestedTask',
      //       row: task,
      //     }),
      // },
      // {
      //   label: task.is_active ? 'تعطيل المهمة' : 'تفعيل المهمة',
      //   command: () =>
      //     this.actionClick.emit({
      //       action: 'toggleSuggestedTask',
      //       row: task,
      //     }),
      // },
      // {
      //   label: 'حذف المهمة',
      //   command: () =>
      //     this.actionClick.emit({
      //       action: 'deleteSuggestedTask',
      //       row: task,
      //     }),
      // },
      {
        label: 'مهمه مكتمله',
        command: () =>
          this.actionClick.emit({
            action: 'deleteSuggestedTask',
            row: task,
          }),
      },
      {
        label: 'ارشفة المهمه',
        command: () =>
          this.actionClick.emit({
            action: 'deleteSuggestedTask',
            row: task,
          }),
      },
    ];
  }
  getStatusMeta(status: string) {
    const statuses: Record<string, { color: string; bg: string }> = {
      pending: { color: '#D97706', bg: '#FEF3C7' },
      in_progress: { color: '#2563EB', bg: '#DBEAFE' },
      completed: { color: '#16A34A', bg: '#DCFCE7' },
    };

    return statuses[status] || { color: '#6B7280', bg: '#F3F4F6' };
  }
}
