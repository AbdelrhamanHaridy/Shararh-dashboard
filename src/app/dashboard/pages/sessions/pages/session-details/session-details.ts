import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { SharedKpiCard } from '../../../../shared/components/shared-kpi-card/shared-kpi-card';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { RejectPaymentRequestDialog } from '../../components/reject-payment-request-dialog/reject-payment-request-dialog';
import { EditPaymentRequestDialog } from '../../components/edit-payment-request-dialog/edit-payment-request-dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ReviewContactLogDialog } from '../../components/review-contact-log-dialog/review-contact-log-dialog';
import { ReviewTasksDialog } from '../../components/review-tasks-dialog/review-tasks-dialog';
import { ReviewSubscriptionsDialog } from '../../components/review-subscriptions-dialog/review-subscriptions-dialog';
import { SessionsService } from '../../services/sessions.service';
import {
  CommunicationReviewItem,
  SessionDetailsData,
  SubscriptionReviewItem,
} from '../../models/session-details.model';
import { RateSessionDialog } from '../../components/rate-session-dialog/rate-session-dialog';

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

interface CommunicationEntryView {
  id: number;
  name: string;
  time: string;
  timeAgo: string;
  borderColor: string;
  direction: string;
  contactType: string;
  reason: string;
}

const CHANNEL_COLORS: Record<string, string> = {
  whatsapp: '#16A34A',
  phone: '#2563EB',
  email: '#7C3AED',
};

@Component({
  selector: 'app-session-details',
  standalone: true,
  imports: [CommonModule, SharedTableComponent, SharedKpiCard, PageHeaderComponent],
  providers: [DialogService],
  templateUrl: './session-details.html',
  styleUrl: './session-details.scss',
})
export class SessionDetails implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly sessionsService = inject(SessionsService);
  private readonly dialogService = inject(DialogService);

  home = { icon: 'pi pi-home', routerLink: '/' };
  breadcrumbItems: BreadcrumbItem[] = [{ label: 'لوحة التحكم', routerLink: '/home' }];

  ref: DynamicDialogRef | null = null;

  sessionId!: string;

  isLoading = signal(false);
  isEnding = signal(false);
  isArchiving = signal(false);
  errorMessage = signal<string | null>(null);
  actionMessage = signal<string | null>(null);
  details = signal<SessionDetailsData | null>(null);

  kpis = computed<KpiCard[]>(() => {
    const stats = this.details()?.stats;
    return [
      {
        title: 'إجمالي النقاط',
        number: stats?.total_points ?? 0,
        iconPath: 'assets/icons/cards/star.svg',
        iconBgColor: '#FEF3C7',
        numberColor: '#0F172A',
      },
      {
        title: 'عمليات التواصل',
        number: stats?.communications_count ?? 0,
        iconPath: 'assets/icons/cards/phone.svg',
        iconBgColor: '#DCFCE7',
        numberColor: '#0F172A',
      },
      {
        title: 'الشكاوي',
        number: stats?.complaints_count ?? 0,
        iconPath: 'assets/icons/cards/alert.svg',
        iconBgColor: '#FEE2E2',
        numberColor: '#0F172A',
      },
      {
        title: 'الاشتراكات',
        number: stats?.subscriptions_count ?? 0,
        iconPath: 'assets/icons/cards/calendar.svg',
        iconBgColor: '#DBEAFE',
        numberColor: '#0F172A',
      },
    ];
  });

  session = computed(() => {
    const header = this.details()?.header;
    return {
      employeeName: header?.employee.name ?? '-',
      avatarUrl: header?.employee.avatar || 'assets/testing/avatar.png',
      durationHours: header?.shift_hours ?? '-',
      timeRange: header ? `${header.start_time || '-'} - ${header.end_time || 'جارية'}` : '-',
      rating: header?.rating_label ?? 'غير مقيّمة',
      reviewStatus:
        header?.review_status_label === 'enums.review_status.pending'
          ? 'غير مراجعة'
          : (header?.review_status_label ?? '-'),
      status: header?.status ?? 'closed',
    };
  });

  subscriptionTiers = computed<SubscriptionTier[]>(() => {
    const sub = this.details()?.subscription_review;
    return [
      { label: 'شهري', count: sub?.monthly_count ?? 0, color: '#16A34A' },
      { label: 'نصف سنوي', count: sub?.semiannual_count ?? 0, color: '#86EFAC' },
      { label: 'سنوي', count: sub?.annual_count ?? 0, color: '#DCFCE7' },
    ];
  });

  subscriptionTotal = computed(() => {
    const total = this.subscriptionTiers().reduce((sum, tier) => sum + tier.count, 0);
    return total > 0 ? total : 1; // avoid divide-by-zero in width calc
  });

  subscriptionColumns = [
    { field: 'customer', header: 'العميل' },
    { field: 'planType', header: 'نوع الاشتراك' },
    { field: 'duration', header: 'مدة الاشتراك' },
    { field: 'amount', header: 'المبلغ' },
    { field: 'paymentMethod', header: 'طريقة الدفع' },
    { field: 'status', header: 'الحاله' },
  ];

  subscriptionRows = computed(() =>
    (this.details()?.subscription_review.items ?? []).map((item: SubscriptionReviewItem) => ({
      id: item.id,
      customer: item.customer_name,
      planType: item.plan_type_label,
      duration: item.duration,
      amount: item.amount,
      paymentMethod: item.payment_method_label,
      status: item.status_label,
    })),
  );

  tasks = computed(() => this.details()?.tasks.items ?? []);

  completedTasksLabel = computed(() => {
    const t = this.details()?.tasks;
    return t ? `${t.completed}/${t.total} مكتمل` : '0/0 مكتمل';
  });

  communicationLog = computed<CommunicationEntryView[]>(() =>
    (this.details()?.communication_review ?? []).map((entry: CommunicationReviewItem) => ({
      id: entry.id,
      name: entry.customer_name,
      time: entry.time,
      timeAgo: entry.time_ago,
      borderColor: CHANNEL_COLORS[entry.channel] ?? '#94A3B8',
      direction: entry.direction_label,
      contactType: entry.contact_type_label,
      reason: entry.reason,
    })),
  );

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.paramMap.get('id') ?? '';
    if (this.sessionId) {
      this.fetchDetails();
    }
  }

  fetchDetails(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.sessionsService.getAdminSessionDetails(this.sessionId).subscribe({
      next: (res) => {
        this.details.set(res.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error?.error?.message || 'حدث خطأ أثناء تحميل تفاصيل الجلسة، حاول مرة أخرى',
        );
      },
    });
  }

  onEndSession(): void {
    if (this.session().status !== 'active') return;
    if (!confirm('هل أنت متأكد من إنهاء هذه الجلسة؟')) return;

    this.isEnding.set(true);
    this.errorMessage.set(null);

    this.sessionsService.endSession(this.sessionId).subscribe({
      next: () => {
        this.isEnding.set(false);
        this.actionMessage.set('تم إنهاء الجلسة بنجاح');
        this.fetchDetails(); // refresh header/status/duration
      },
      error: (error) => {
        this.isEnding.set(false);
        this.errorMessage.set(error?.error?.message || 'حدث خطأ أثناء إنهاء الجلسة');
      },
    });
  }

  onRateSession(): void {
    this.ref = this.dialogService.open(RateSessionDialog, {
      width: '450px',
      modal: true,
      header: 'تقييم ومحوظة',
      closable: true,
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      data: { sessionId: this.sessionId },
    });

    if (this.ref) {
      this.ref.onClose.subscribe((result) => {
        if (result) {
          this.actionMessage.set('تم حفظ التقييم بنجاح');
          this.fetchDetails(); // refresh rating/review_status in header
        }
      });
    }
  }

  onArchiveSession(): void {
    if (!confirm('هل أنت متأكد من أرشفة هذه الجلسة؟')) return;

    this.isArchiving.set(true);
    this.errorMessage.set(null);

    this.sessionsService.archiveSession(this.sessionId).subscribe({
      next: () => {
        this.isArchiving.set(false);
        this.actionMessage.set('تم أرشفة الجلسة بنجاح');
      },
      error: (error) => {
        this.isArchiving.set(false);
        this.errorMessage.set(error?.error?.message || 'حدث خطأ أثناء أرشفة الجلسة');
      },
    });
  }

  onReviewSubscriptions(): void {
    this.ref = this.dialogService.open(ReviewSubscriptionsDialog, {
      width: '586px',
      modal: true,
      header: 'مراجعة الاشتراكات',
      closable: true,
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      data: { sessionId: this.sessionId },
    });
  }

  onReviewTasks(): void {
    this.ref = this.dialogService.open(ReviewTasksDialog, {
      width: '586px',
      modal: true,
      header: 'مراجعة السجل',
      closable: true,
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      data: { sessionId: this.sessionId },
    });
  }

  onReviewCommunicationLog(): void {
    this.ref = this.dialogService.open(ReviewContactLogDialog, {
      width: '586px',
      modal: true,
      header: 'مراجعة السجل',
      closable: true,
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      data: { sessionId: this.sessionId },
    });
  }

  onSessionRowClick(row: { id: number }): void {
    this.ref = this.dialogService.open(EditPaymentRequestDialog, {
      width: '450px',
      modal: true,
      header: 'تعديل طلب الدفع',
      closable: true,
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      data: { subscriptionId: row.id },
    });
  }
}
