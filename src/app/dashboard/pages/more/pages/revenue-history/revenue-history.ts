import { Component, inject } from '@angular/core';
import { SharedKpiCard } from '../../../../shared/components/shared-kpi-card/shared-kpi-card';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-revenue-history',
  imports: [SharedKpiCard, SharedTableComponent, PageHeaderComponent],
  templateUrl: './revenue-history.html',
  styleUrl: './revenue-history.scss',
})
export class RevenueHistory {
  private router = inject(Router);

  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };

  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'سجل الايرادات', routerLink: '/more/revenue-history' },
  ];

  columns = [
    { field: 'branchName', header: 'اسم الفرع', style: { fontSize: '16px', color: '#1A1C18' } },
    // { field: 'submissionTime', header: 'وقت التقديم' },
    // { field: 'reviewTime', header: 'وقت المراجعة' },
    { field: 'startTime', header: 'وقت التقديم', style: { color: '#1A1C18' }  },
    { field: 'endTime', header: 'وقت المراجعة', style: { color: '#1A1C18' }  },
    { field: 'paymentMethod', header: 'وسيلة الدفع' },
    {
      field: 'discountCoupon',
      header: 'كوبون الخصم',
      style: { fontSize: '14px', color: '#1A1C18' },
    },
    { field: 'amount', header: 'مبلغ الاشتراك' },
    { field: 'processStatus', header: 'حالة العملية' },
  ];

  revenueRecords = [
    {
      branchName: 'الفرع الرئيسي',
      // submissionTime: '2023/09/15 14:22',
      // reviewTime: '2023/09/15 16:30',
      startTime: '08:30 ص',
      startDate: '3 مارس 2023',
      endTime: '09:15 ص',
      endDate: '3 مارس 2023',
      paymentMethod: 'بطاقة ائتمان',
      discountCoupon: 'SAVE20',
      amount: '500',
      processStatus: 'ناجحة',
    },
    {
      branchName: 'فرع الرياض',
      // submissionTime: '2023/09/14 10:15',
      // reviewTime: '2023/09/14 12:45',
      startTime: '08:30 ص',
      startDate: '3 مارس 2023',
      endTime: '09:15 ص',
      endDate: '3 مارس 2023',
      paymentMethod: 'تحويل بنكي',
      discountCoupon: 'WELCOME10',
      amount: '350',
      processStatus: 'ناجحة',
    },
    {
      branchName: 'فرع جدة',
      // submissionTime: '2023/09/13 09:30',
      // reviewTime: '2023/09/13 11:20',
      startTime: '08:30 ص',
      startDate: '3 مارس 2023',
      endTime: '09:15 ص',
      endDate: '3 مارس 2023',
      paymentMethod: 'مدى',
      discountCoupon: 'لا يوجد',
      amount: '750',
      processStatus: 'ناجحة المراجعة',
    },
    {
      branchName: 'فرع الدمام',
      // submissionTime: '2023/09/12 16:45',
      // reviewTime: '2023/09/13 09:00',
      startTime: '08:30 ص',
      startDate: '3 مارس 2023',
      endTime: '09:15 ص',
      endDate: '3 مارس 2023',
      paymentMethod: 'بطاقة ائتمان',
      discountCoupon: 'FLASH50',
      amount: '250',
      processStatus: 'ناجحة',
    },
    {
      branchName: 'الفرع الرئيسي',
      // submissionTime: '2023/09/11 11:00',
      // reviewTime: '2023/09/11 14:15',
      startTime: '08:30 ص',
      startDate: '3 مارس 2023',
      endTime: '09:15 ص',
      endDate: '3 مارس 2023',
      paymentMethod: 'تحويل بنكي',
      discountCoupon: 'VIP25',
      amount: '600',
      processStatus: 'ناجحة',
    },
    {
      branchName: 'فرع مكة',
      // submissionTime: '2023/09/10 08:20',
      // reviewTime: '2023/09/10 10:40',
      startTime: '08:30 ص',
      startDate: '3 مارس 2023',
      endTime: '09:15 ص',
      endDate: '3 مارس 2023',
      paymentMethod: 'مدى',
      discountCoupon: 'SUMMER15',
      amount: '420',
      processStatus: 'ناجحة',
    },
  ];

  totalRecords = this.revenueRecords.length;

  onRowClick(row: any): void {
    this.router.navigate(['/more/revenue-history/details', row.id]);
  }
}
