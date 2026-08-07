import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { SharedKpiCard } from '../../../../shared/components/shared-kpi-card/shared-kpi-card';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { RejectPaymentRequestDialog } from '../../components/reject-payment-request-dialog/reject-payment-request-dialog';
import { EditPaymentRequestDialog } from '../../components/edit-payment-request-dialog/edit-payment-request-dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ReviewContactLogDialog } from '../../components/review-contact-log-dialog/review-contact-log-dialog';
import { ReviewTasksDialog } from '../../components/review-tasks-dialog/review-tasks-dialog';
import { ReviewSubscriptionsDialog } from '../../components/review-subscriptions-dialog/review-subscriptions-dialog';

// TODO: import the real shared components from your project, e.g.:
// import { PageHeaderComponent } from '../../shared/page-header/page-header';
// import { SharedKpiCardComponent } from '../../shared/kpi-card/kpi-card';
// import { SharedTableComponent } from '../../shared/table/table';

interface BreadcrumbItem {
  label: string;
  routerLink?: string;
}

interface KpiCard {
  title: string;
  number: number | string;
  iconPath: string;
  iconBgColor: string;
  numberColor: string;
}

interface SubscriptionTier {
  label: string;
  count: number;
  color: string;
}

interface SubscriptionRow {
  id: number;
  customer: string;
  planType: string;
  duration: string;
  amount: string;
  paymentMethod: string;
  status: string;
}

interface TaskItem {
  id: number;
  label: string;
}

interface CommunicationEntry {
  id: number;
  name: string;
  time: string;
  timeAgo: string;
  borderColor: string;
  direction: string;
  contactType: string;
  reason: string;
  channelIcon: string;
  iconBg: string;
  iconColor: string;
}

@Component({
  selector: 'app-session-details',
  standalone: true,
  imports: [CommonModule, SharedTableComponent, SharedKpiCard, PageHeaderComponent],
  providers: [DialogService],

  templateUrl: './session-details.html',
  styleUrl: './session-details.scss',
})
export class SessionDetails {
  home = { icon: 'pi pi-home', routerLink: '/' };
  breadcrumbItems: BreadcrumbItem[] = [{ label: 'لوحة التحكم', routerLink: '/dashboard' }];

  ref: DynamicDialogRef | null = null;

  constructor(private readonly dialogService: DialogService) {}

  kpis: KpiCard[] = [
    {
      title: 'إجمالي النقاط',
      number: '1,240',
      iconPath: 'assets/icons/cards/star.svg',
      iconBgColor: '#FEF3C7',
      numberColor: '#0F172A',
    },
    {
      title: 'عمليات التواصل',
      number: 42,
      iconPath: 'assets/icons/cards/phone.svg',
      iconBgColor: '#DCFCE7',
      numberColor: '#0F172A',
    },
    {
      title: 'الشكاوي',
      number: 4,
      iconPath: 'assets/icons/cards/alert.svg',
      iconBgColor: '#FEE2E2',
      numberColor: '#0F172A',
    },
    {
      title: 'تسجيلات اليوم',
      number: 15,
      iconPath: 'assets/icons/cards/calendar.svg',
      iconBgColor: '#DBEAFE',
      numberColor: '#0F172A',
    },
  ];

  session = {
    employeeName: 'أحمد كمال',
    avatarUrl: 'assets/testing/avatar.png',
    durationHours: 8,
    timeRange: '09:00 م - 05:00 ص',
    rating: 'مقبولة',
    reviewStatus: 'غير مراجعة',
  };

  subscriptionTiers: SubscriptionTier[] = [
    { label: 'شهري', count: 9, color: '#16A34A' },
    { label: 'نصف سنوي', count: 4, color: '#86EFAC' },
    { label: 'سنوي', count: 2, color: '#DCFCE7' },
  ];

  get subscriptionTotal(): number {
    return this.subscriptionTiers.reduce((sum, tier) => sum + tier.count, 0);
  }

  subscriptionColumns = [
    { field: 'customer', header: 'العميل' },
    { field: 'planType', header: 'نوع الاشتراك' },
    { field: 'duration', header: 'مدة الاشتراك' },
    { field: 'amount', header: 'المبلغ' },
    { field: 'paymentMethod', header: 'طريقة الدفع' },
    { field: 'status', header: 'الحاله' },
  ];

  subscriptionRows: SubscriptionRow[] = [
    {
      id: 1,
      customer: 'محمد احمد',
      planType: 'باقة النمو',
      duration: 'سنوي',
      amount: '4,500',
      paymentMethod: 'بطاقة',
      status: 'مكتمل',
    },
    {
      id: 2,
      customer: 'محمد احمد',
      planType: 'باقة النمو',
      duration: 'سنوي',
      amount: '4,500',
      paymentMethod: 'بطاقة',
      status: 'مكتمل',
    },
  ];

  tasks: TaskItem[] = [
    { id: 1, label: 'تحديث بيانات العميل الجديد' },
    { id: 2, label: 'مراجعة طلبات الدفع المعلقة' },
    { id: 3, label: 'إرسال تقرير الجلسة اليومي' },
  ];

  completedTasksLabel = '٧/١٠ مكتمل';

  communicationLog: CommunicationEntry[] = [
    {
      id: 1,
      name: 'أحمد محمد العتيبي',
      time: '10:45 ص',
      timeAgo: 'قبل ساعة',
      borderColor: '#10A922',
      direction: 'صادر',
      contactType: 'مكالمة هاتفية',
      reason: 'استفسار عن رصيد',
      channelIcon: 'pi pi-phone',
      iconBg: '#DBEAFE',
      iconColor: '#2563EB',
    },
    {
      id: 2,
      name: 'سارة خالد سليمان',
      time: '04:20 م',
      timeAgo: '24 مايو',
      borderColor: '#16A34A',
      direction: 'وارد',
      contactType: 'واتساب',
      reason: 'تأكيد تحويل بنكي',
      channelIcon: 'pi pi-whatsapp',
      iconBg: '#DCFCE7',
      iconColor: '#16A34A',
    },
  ];

  onEndSession(): void {
    this.onRejectPaymentRequestDialog();
  }
  onRateSession(): void {}
  onReviewSubscriptions(): void {
    this.ref = this.dialogService.open(ReviewSubscriptionsDialog, {
      width: '586px',
      modal: true,
      header: 'مراجعة الاشتراكات',
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {},
    });
  }
  onReviewTasks(): void {
    this.ref = this.dialogService.open(ReviewTasksDialog, {
      width: '586px',
      modal: true,
      header: 'مراجعة السجل',
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {},
    });
  }
  onReviewCommunicationLog(): void {
    this.ref = this.dialogService.open(ReviewContactLogDialog, {
      width: '586px',
      modal: true,
      header: 'مراجعة السجل',
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {},
    });
  }
  onSessionRowClick(): void {
    this.ref = this.dialogService.open(EditPaymentRequestDialog, {
      width: '450px',
      modal: true,
      header: 'تعديل طلب الدفع',
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {},
    });
  }
  onRejectPaymentRequestDialog(): void {
    this.ref = this.dialogService.open(RejectPaymentRequestDialog, {
      width: '404px',
      modal: true,
      header: 'رفض طلب الدفع',
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {},
    });
  }
}
