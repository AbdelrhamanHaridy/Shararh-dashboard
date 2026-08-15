import { ChangeDetectorRef, Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { SharedKpiCard } from '../../../../shared/components/shared-kpi-card/shared-kpi-card';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import {
  RevenueTableRow,
  RevenueFilters,
  RevenueTransaction,
  RevenueStatistics,
} from './models/revenue.model';
import { RevenueService } from './services/revenue.service';
import { PricingAndPlansService } from '../pricing-and-plans/services/pricing-and-plans.service';
import { PaymentMethodsService } from '../payment-methods-settings/services/payment-methods-settings.service';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';

@Component({
  selector: 'app-revenue-history',
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    DatePickerModule,
    SelectModule,
    ButtonModule,
    SharedKpiCard,
    SharedTableComponent,
    PageHeaderComponent,
  ],
  templateUrl: './revenue-history.html',
  styleUrl: './revenue-history.scss',
})
export class RevenueHistory implements OnInit {
  private router = inject(Router);
  private revenueService = inject(RevenueService);
  private planService = inject(PricingAndPlansService);
  private paymentMethodService = inject(PaymentMethodsService);
  private cdr = inject(ChangeDetectorRef);

  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };

  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'سجل الايرادات', routerLink: '/more/revenue-history' },
  ];

  columns = [
    { field: 'branchName', header: 'اسم الفرع', style: { fontSize: '16px', color: '#1A1C18' } },
    { field: 'startTime', header: 'وقت التقديم', style: { color: '#1A1C18' } },
    { field: 'endTime', header: 'وقت المراجعة', style: { color: '#1A1C18' } },
    { field: 'paymentMethod', header: 'وسيلة الدفع' },
    {
      field: 'discountCoupon',
      header: 'كوبون الخصم',
      style: { fontSize: '14px', color: '#1A1C18' },
    },
    { field: 'amount', header: 'مبلغ الاشتراك' },
    { field: 'processStatus', header: 'حالة العملية' },
  ];

  revenueRecords: RevenueTableRow[] = [];
  totalRecords = 0;
  isLoading = false;
  currentPage = 1;

  // Dashboard statistics
  statistics = signal<RevenueStatistics>({
    total_revenue: 0,
    today_revenue: 0,
    active_subscriptions: 0,
    expired_subscriptions: 0,
  });

  // Filter state
  showFilterDialog = signal(false);
  dateFrom = signal<Date | null>(null);
  dateTo = signal<Date | null>(null);
  paymentMethodId = signal<number | null>(null);
  planId = signal<number | null>(null);
  selectedStatus = signal<string | null>(null);

  // Filter options (signals)
  paymentMethods = signal<Array<{ label: string; value: number }>>([]);
  plans = signal<Array<{ label: string; value: number }>>([]);

  statusOptions = [
    { label: 'ناجحه', value: 'successful' },
    { label: 'قيد المراجعه', value: 'pending_review' },
    { label: 'مرفوض', value: 'rejected' },
  ];

  ngOnInit(): void {
    this.loadFilterOptions();
    this.loadDashboard();
    this.loadRevenues();
  }

  private loadFilterOptions(): void {
    // Load payment methods
    this.paymentMethodService.getPaymentMethods().subscribe({
      next: (res) => {
        const methods = res.data.payment_methods.map((method) => ({
          label: method.name,
          value: method.id,
        }));
        this.paymentMethods.set(methods);
      },
      error: (err) => {
        console.error('Failed to load payment methods', err);
      },
    });

    // Load plans
    this.planService.getPlans().subscribe({
      next: (res) => {
        const plansList = res.data.map((plan) => ({
          label: plan.name,
          value: plan.id,
        }));
        this.plans.set(plansList);
      },
      error: (err) => {
        console.error('Failed to load plans', err);
      },
    });
  }

  private loadDashboard(filters: RevenueFilters = {}): void {
    this.revenueService.getDashboard(filters).subscribe({
      next: (res) => {
        this.statistics.set(res.data.statistics);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load dashboard statistics', err);
        this.cdr.detectChanges();
      },
    });
  }

  openFilterDialog(): void {
    this.showFilterDialog.set(true);
  }

  applyFilters(): void {
    const filters: RevenueFilters = {};

    if (this.dateFrom()) {
      filters.date_from = this.formatDate(this.dateFrom()!);
    }
    if (this.dateTo()) {
      filters.date_to = this.formatDate(this.dateTo()!);
    }
    if (this.paymentMethodId()) {
      filters.payment_method_id = this.paymentMethodId()!;
    }
    if (this.planId()) {
      filters.plan_id = this.planId()!;
    }
    if (this.selectedStatus()) {
      filters.status = this.selectedStatus()!;
    }

    this.showFilterDialog.set(false);
    this.currentPage = 1;
    this.loadDashboard(filters);
    this.loadRevenues(filters);
  }

  clearFilters(): void {
    this.dateFrom.set(null);
    this.dateTo.set(null);
    this.paymentMethodId.set(null);
    this.planId.set(null);
    this.selectedStatus.set(null);
    this.showFilterDialog.set(false);
    this.currentPage = 1;
    this.loadDashboard();
    this.loadRevenues();
  }

  onDateFromChange(date: Date | null): void {
    this.dateFrom.set(date);
    this.applyFilters();
  }

  onDateToChange(date: Date | null): void {
    this.dateTo.set(date);
    this.applyFilters();
  }

  onHeaderDateReset(): void {
    this.dateFrom.set(null);
    this.dateTo.set(null);
    this.applyFilters();
  }

  onStatusButtonClick(status: string | null): void {
    this.selectedStatus.set(this.selectedStatus() === status ? null : status);
    // Defer to next tick to allow signal to update before applying filters
    setTimeout(() => this.applyFilters(), 0);
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // ...

  loadRevenues(filters: RevenueFilters = {}): void {
    this.isLoading = true;

    this.revenueService.getRevenues({ page: this.currentPage, ...filters }).subscribe({
      next: (res) => {
        this.revenueRecords = res.data.map((item) => this.mapToTableRow(item));
        this.totalRecords = res.pagination.total;
        this.isLoading = false;
        this.cdr.detectChanges(); // forces sync CD, avoids the mismatch on next pass
      },
      error: (err) => {
        console.error('Failed to load revenue history', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onRowClick(row: RevenueTableRow): void {
    this.router.navigate(['/more/revenue-history/details', row.id]);
  }

  private mapToTableRow(item: RevenueTransaction): RevenueTableRow {
    const submitted = this.splitDateTime(item.payment.submitted_at);
    const reviewed = this.splitDateTime(item.payment.reviewed_at);

    return {
      id: item.id,
      branchName: item.store?.name ?? '-',
      startTime: submitted.time,
      startDate: submitted.date,
      endTime: reviewed.time,
      endDate: reviewed.date,
      paymentMethod: item.payment.payment_method,
      discountCoupon: item.payment.coupon ?? 'لا يوجد',
      amount: item.payment.amount,
      processStatus: item.payment.status_label,
    };
  }

  private splitDateTime(value: string | null): { date: string; time: string } {
    if (!value) return { date: '-', time: '-' };

    const parsed = new Date(value.replace(' ', 'T'));
    if (isNaN(parsed.getTime())) return { date: '-', time: '-' };

    const date = new Intl.DateTimeFormat('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(parsed);

    const time = new Intl.DateTimeFormat('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(parsed);

    return { date, time };
  }
}
