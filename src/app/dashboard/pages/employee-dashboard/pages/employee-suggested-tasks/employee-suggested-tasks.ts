import { Component } from '@angular/core';
import { Breadcrumb } from 'primeng/breadcrumb';
import { ProgressBar } from 'primeng/progressbar';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { SkeletonModule } from 'primeng/skeleton';
import { TieredMenuModule } from 'primeng/tieredmenu';

@Component({
  selector: 'app-employee-suggested-tasks',
  imports: [
    Breadcrumb,
    ProgressBar,
    CommonModule,
    ConfirmDialogModule,
    TieredMenuModule,
    DynamicDialogModule,
    SkeletonModule,
  ],
  templateUrl: './employee-suggested-tasks.html',
  styleUrl: './employee-suggested-tasks.scss',
})
export class EmployeeSuggestedTasks {
  title = 'المهام المقترحه';
  isLoading = false;

  completedTasks = 0;
  totalTasks = 7;

  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };

  breadcrumbItems: MenuItem[] = [
    { label: 'المهام المقترحه' },
  ];

  suggested_tasks = [
    {
      id: 1,
      title: 'مراجعة طلبات العملاء',
      created_at: '2026-11-24',
      status: 'pending',
      status_label: 'قيد الانتظار',
    },
    {
      id: 2,
      title: 'متابعة الشحنات المتأخرة',
      created_at: '2026-11-23',
      status: 'in_progress',
      status_label: 'قيد التنفيذ',
    },
    // {
    //   id: 3,
    //   title: 'تحديث بيانات العملاء',
    //   created_at: '2026-11-22',
    //   status: 'completed',
    //   status_label: 'مكتملة',
    // },
    // {
    //   id: 4,
    //   title: 'مراجعة المخزون',
    //   created_at: '2026-11-21',
    //   status: 'pending',
    //   status_label: 'قيد الانتظار',
    // },
    // {
    //   id: 5,
    //   title: 'إعداد التقرير الأسبوعي',
    //   created_at: '2026-11-20',
    //   status: 'in_progress',
    //   status_label: 'قيد التنفيذ',
    // },
    // {
    //   id: 6,
    //   title: 'مراجعة الفواتير',
    //   created_at: '2026-11-19',
    //   status: 'pending',
    //   status_label: 'قيد الانتظار',
    // },
    // {
    //   id: 7,
    //   title: 'تنظيم ملفات الموظفين',
    //   created_at: '2026-11-18',
    //   status: 'pending',
    //   status_label: 'قيد الانتظار',
    // },
  ];

  getStatusMeta(status: string) {
    const statuses: Record<string, { color: string; bg: string }> = {
      pending: { color: '#D97706', bg: '#FEF3C7' },
      in_progress: { color: '#2563EB', bg: '#DBEAFE' },
      completed: { color: '#16A34A', bg: '#DCFCE7' },
    };

    return statuses[status] || { color: '#6B7280', bg: '#F3F4F6' };
  }
}