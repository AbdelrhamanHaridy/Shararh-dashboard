import { Component, OnInit, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedKpiCard } from '../../shared/components/shared-kpi-card/shared-kpi-card';
import { ChildTableComponent } from '../../shared/components/child-table/child-table.component';
import { SliderModule } from 'primeng/slider';
import { DonutChartComponent } from '../../shared/charts/donut-chart/donut-chart.component';
import { NotificationComponent } from '../../shared/components/notification/notification';
import { BaseComponent } from '../../shared/services/base.component';
import { HomeService } from './services/home.service';
import { takeUntil } from 'rxjs';
import { DashboardData, Employee, Notification } from './models/home.models';
import { RelativeTimePipe } from '../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-home',
  imports: [
    CommonModule,
    SharedKpiCard,
    ChildTableComponent,
    SliderModule,
    DonutChartComponent,
    NotificationComponent,
    RelativeTimePipe,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home extends BaseComponent implements OnInit {
  dashboardData = signal<DashboardData | null>(null);
  isLoading = signal(false);

  summary = computed(() => this.dashboardData()?.summary);
  employees = computed(() => this.dashboardData()?.employee_performance.employees || []);
  customerStatistics = computed(() => this.dashboardData()?.customer_statistics);
  notifications = computed(() => this.dashboardData()?.recent_notifications || []);
  customerRequests = computed(() => this.dashboardData()?.customer_requests || []);

  subscriptionChartData = computed(() => {
    const stats = this.customerStatistics()?.subscription_status;
    if (!stats) return [];
    return [
      { value: stats.active.count, name: 'نشط' },
      { value: stats.expired.count, name: 'منتهي' },
      { value: stats.trial.count, name: 'تجريبي' },
    ];
  });

  customerChartData = computed(() => {
    const stats = this.customerStatistics()?.customer_status;
    if (!stats) return [];
    return [
      { value: stats.registered_only.count, name: 'مسجل فقط' },
      { value: stats.subscribed.count, name: 'مشترك' },
      { value: stats.expired_subscription.count, name: 'اشتراك منتهي' },
    ];
  });

  sessionColumns: any[] = [
    { field: 'full_name', header: 'اسم الموظف' },
    { field: 'role', header: 'الدور' },
    { field: 'today_points', header: 'النقاط' },
    { field: 'session_status', header: 'الحالة' },
  ];

  constructor(private homeService: HomeService) {
    super();
  }

  ngOnInit(): void {
    this.isLoading.set(true);
    this.homeService
      .getDashboard()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.dashboardData.set(res.data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching dashboard data:', err);
          this.isLoading.set(false);
        },
      });
  }

  getSessionStatus(status: string): string {
    const statusMap: Record<string, string> = {
      online: 'نشط',
      offline: 'غير نشط',
      busy: 'مشغول',
      away: 'بعيد',
    };
    return statusMap[status] || status;
  }
}
