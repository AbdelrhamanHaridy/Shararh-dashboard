import { Component, inject } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { SharedKpiCard } from '../../shared/components/shared-kpi-card/shared-kpi-card';
import { SharedSelectComponent } from '../../shared/components/shared-select/shared-select.component';
import { SharedTableComponent } from '../../shared/components/shared-table/shared-table.component';
import { Router } from '@angular/router';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { RejectPaymentRequestDialog } from './components/reject-payment-request-dialog/reject-payment-request-dialog';

@Component({
  selector: 'app-sessions',
  imports: [PageHeaderComponent, SharedKpiCard, SharedSelectComponent, SharedTableComponent],
  templateUrl: './sessions.html',
  styleUrl: './sessions.scss',
})
export class Sessions {
  private readonly router = inject(Router);

  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };
  breadcrumbItems: MenuItem[] = [{ label: 'الجلسات', routerLink: '/sessions' }];

  contactViaOptions = [
    { label: 'هاتف', value: 'phone' },
    { label: 'بريد الكتروني', value: 'email' },
    { label: 'واتس اب', value: 'whatsapp' },
    { label: 'الموقع المجاني', value: 'website' },
  ];

  columns = [
    { field: 'employeeName', header: 'اسم الموظف' },
    { field: 'startTime', header: 'وقت البدء' },
    { field: 'endTime', header: 'وقت الانتهاء' },
    {
      field: 'duration',
      header: 'المدة',
      style: { fontWeight: 'bold', color: '#191C19', fontSize: '16px' },
    },
    { field: 'status', header: 'حالة الجلسة' },
    { field: 'rating', header: 'التقييم' },
    {
      field: 'operations',
      header: 'العمليات',
      style: { fontWeight: 'bold', color: '#191C19', fontSize: '16px' },
    }, 
    { field: 'actions', header: '' },
  ];

  sessions = [
    {
      avatarUrl: 'assets/testing/avatar.png',
      employeeName: 'أحمد حسن',
      jobTitle: 'مهندس برمجيات',
      startTime: '08:30 ص',
      startDate: '3 مارس 2023',
      endTime: '09:15 ص',
      endDate: '3 مارس 2023',
      duration: '60 min',
      status: 'نشط',
      rating: 'ممتازة',
      operations: '90',
    },
    {
      avatarUrl: 'assets/testing/avatar.png',
      employeeName: 'محمد علي',
      jobTitle: 'مصمم واجهات المستخدم',
      startTime: '08:30 ص',
      startDate: '3 مارس 2023',
      endTime: '09:15 ص',
      endDate: '3 مارس 2023',
      duration: '45 min',
      status: 'نشط',
      rating: 'ممتازة',
      operations: '90',
    },
    {
      avatarUrl: 'assets/testing/avatar.png',
      employeeName: 'عمر خالد',
      jobTitle: 'محلل نظم',
      startTime: '08:30 ص',
      startDate: '3 مارس 2023',
      endTime: '09:15 ص',
      endDate: '3 مارس 2023',
      duration: '60 min',
      status: 'غير نشط',
      rating: 'ممتازة',
      operations: '90',
    },
    {
      avatarUrl: 'assets/testing/avatar.png',
      employeeName: 'يوسف نبيل',
      jobTitle: 'مدير مشروع',
      startTime: '08:30 ص',
      startDate: '3 مارس 2023',
      endTime: '09:15 ص',
      endDate: '3 مارس 2023',
      duration: '90 min',
      status: 'نشط',
      rating: 'ممتازة',
      operations: '90',
    },
    {
      avatarUrl: 'assets/testing/avatar.png',
      employeeName: 'كريم سمير',
      jobTitle: 'مدير مشروع',
      startTime: '08:30 ص',
      startDate: '3 مارس 2023',
      endTime: '09:15 ص',
      endDate: '3 مارس 2023',
      duration: '60 min',
      status: 'نشط',
      rating: 'ممتازة',
      operations: '90',
    },
    {
      avatarUrl: 'assets/testing/avatar.png',
      employeeName: 'طارق فوزي',
      jobTitle: 'مهندس برمجيات',
      startTime: '08:30 ص',
      startDate: '3 مارس 2023',
      endTime: '09:15 ص',
      endDate: '3 مارس 2023',
      duration: '30 min',
      status: 'غير نشط',
      rating: 'ممتازة',
      operations: '90',
    },
  ];

  totalSessions = this.sessions.length;

  onSessionRowClick(): void {
    this.router.navigate(['/sessions/session-details']);
  }
}
