import { Component, computed, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedKpiCard } from '../../shared/components/shared-kpi-card/shared-kpi-card';
import { ChildTableComponent } from '../../shared/components/child-table/child-table.component';
import { DonutChartComponent } from '../../shared/charts/donut-chart/donut-chart.component';
import { takeUntil } from 'rxjs';
import { EmployeeDashboardData } from './models/employee-dashboard.model';
import { EmployeeDashboardService } from './services/employee-dashboard.service';
import { BaseComponent } from '../../shared/services/base.component';

@Component({
  selector: 'app-employee-dashboard',
  imports: [CommonModule, SharedKpiCard, ChildTableComponent, DonutChartComponent],
  templateUrl: './employee-dashboard.html',
  styleUrl: './employee-dashboard.scss',
})
export class EmployeeDashboard extends BaseComponent implements OnInit {
  dashboardData = signal<EmployeeDashboardData | null>(null);
  isLoading = signal(false);
  errorMessage = signal('');

  summary = computed(() => this.dashboardData()?.summary);
  referral = computed(() => this.dashboardData()?.referral);
  visitsStatistics = computed(() => this.dashboardData()?.visits_statistics);
  employees = computed(() => this.dashboardData()?.visits_statistics.employees ?? []);

  // Field exists in the API but is always [] in the sample response — shape unknown.
  // Leaving the table wired up but empty until a populated example is available.
  expiringSubscriptions = computed(() => this.dashboardData()?.expiring_subscriptions ?? []);

  coupons = computed(() => this.dashboardData()?.my_coupons ?? []);

  // Donut 1: "عملائي المشتركين" — direct 1:1 match with API fields
  subscribedClientsChartData = computed(() => {
    const stats = this.dashboardData()?.customer_statistics.subscriptions;
    if (!stats) return [];
    return [
      { value: stats.active.count, name: 'نشط' },
      { value: stats.expired.count, name: 'منتهي' },
      { value: stats.trial.count, name: 'تجريبي' },
    ];
  });

  // Donut 2: "عملائي المسجلين" — PARTIAL MATCH ONLY.
  // API has no "مشترك"/"غير مشترك" boolean; derived as:
  //   مسجل فقط = registered_only (direct)
  //   مشترك    = trial + active + expired (anyone with any subscription history)
  // "غير مشترك" has no distinct source and is intentionally omitted — see chat notes.
  registeredClientsChartData = computed(() => {
    const stats = this.dashboardData()?.customer_statistics.subscriptions;
    if (!stats) return [];
    const subscribedCount = stats.trial.count + stats.active.count + stats.expired.count;
    return [
      { value: stats.registered_only.count, name: 'مسجل فقط' },
      { value: subscribedCount, name: 'مشترك' },
    ];
  });

  employeeColumns: any[] = [
    { field: 'name', header: 'اسم الموظف' },
    { field: 'role', header: 'الدور' },
    { field: 'today_points', header: 'نقاط اليوم' },
    { field: 'today_visits', header: 'زيارات اليوم' },
    { field: 'status', header: 'الحالة' },
  ];

  couponColumns: any[] = [
    { field: 'code', header: 'الكود' },
    { field: 'status', header: 'الحالة' },
    { field: 'target', header: 'الفئة المستهدفة' },
    { field: 'usage_count', header: 'مرات الاستخدام' },
    { field: 'max_usage', header: 'الحد الأقصى' },
  ];

  constructor(private employeeDashboardService: EmployeeDashboardService) {
    super();
  }

  ngOnInit(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.employeeDashboardService
      .getDashboard()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.dashboardData.set(res.data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching dashboard data:', err);
          this.errorMessage.set('حدث خطأ أثناء تحميل بيانات لوحة التحكم');
          this.isLoading.set(false);
        },
      });
  }

  copyReferralLink() {
    const url = this.referral()?.url;
    if (!url) return;
    navigator.clipboard?.writeText(url).catch((err) => {
      console.error('Failed to copy referral link:', err);
    });
  }
}