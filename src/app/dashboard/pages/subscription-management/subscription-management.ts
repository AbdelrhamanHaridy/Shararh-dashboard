import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  signal,
  computed,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SharedKpiCard } from '../../shared/components/shared-kpi-card/shared-kpi-card';
import { MenuItem } from 'primeng/api';
import { SubscriptionCard } from './components/subscription-card/subscription-card';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { BranchStaffManagement } from './components/branch-staff-management/branch-staff-management';
import { AddNewSubscriber } from './components/add-new-subscriber/add-new-subscriber';
import { BranchDetailsDialog } from './components/branch-details-dialog/branch-details-dialog';
import { TimelineOfEventsDialog } from './components/timeline-of-events-dialog/timeline-of-events-dialog';
import { SubscriptionPlanDialog } from './components/subscription-plan-dialog/subscription-plan-dialog';
import { BaseComponent } from '../../shared/services/base.component';
import { SubscriptionsService } from './services/subscriptions.service';
import { takeUntil } from 'rxjs';
import { Store } from './models/subscription-stores.model';
import { StoreStatistics } from './models/subscription-stats.model';

@Component({
  selector: 'app-subscription-management',
  imports: [CommonModule, SharedKpiCard, PageHeaderComponent, SubscriptionCard],
  providers: [DialogService],
  templateUrl: './subscription-management.html',
  styleUrl: './subscription-management.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionManagement extends BaseComponent implements OnInit {
  private subscriptionsService = inject(SubscriptionsService);

  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };
  breadcrumbItems = [{ label: 'إدارة الاشتراكات' }];

  // State signals
  statistics = signal<StoreStatistics | null>(null);
  stores = signal<Store[]>([]);
  isLoading = signal(false);

  // Computed subscriptions formatted for display
  subscriptions = computed(() => {
    return this.stores().map((store) => ({
      id: store.id,
      status: store.subscription?.status || 'غير نشط',
      statusColor: this.getStatusColor(store.subscription?.status || 'inactive'),
      statusBgColor: this.getStatusBgColor(store.subscription?.status || 'inactive'),
      merchantName: store.name,
      ownerName: store.owner?.name || 'غير محدد',
      isTrial: store.subscription?.is_trial || false,
      planName: store.subscription?.plan_name || '',
      subscriptionType: store.subscription?.is_trial ? 'فترة تجريبية' : '',
      officesCount: store.offices_count,
      phone: store.phone,
      location: `${store.city || 'غير محدد'} - ${store.governorate || ''}`,
      paymentGateway: 'غير محدد',
      merchantType: 'غير محدد',
      displayDate: store.subscription?.starts_at
        ? new Date(store.subscription.starts_at).toLocaleDateString('ar-EG')
        : 'غير محدد',
      actionDate: store.subscription?.ends_at
        ? new Date(store.subscription.ends_at).toLocaleDateString('ar-EG')
        : 'غير محدد',
      daysLeft: store.subscription?.days_left || 0,
    }));
  });

  ref: DynamicDialogRef | null = null;

  constructor(public dialogService: DialogService) {
    super();
  }

  ngOnInit(): void {
    this.loadData();
  }

  private loadData(): void {
    this.isLoading.set(true);

    // Fetch statistics
    this.subscriptionsService
      .getStatistics()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.statistics.set(res.data.statistics);
        },
        error: (err) => {
          console.error('Error fetching statistics:', err);
        },
      });

    // Fetch stores
    this.subscriptionsService
      .getStores()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.stores.set(res.data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching stores:', err);
          this.isLoading.set(false);
        },
      });
  }

  private getStatusColor(status: string): string {
    const statusMap: Record<string, string> = {
      active: '#10A922',
      expired: '#D22F27',
      trial: '#FF9500',
      suspended: '#666666',
      pending: '#FF9500',
    };
    return statusMap[status.toLowerCase()] || '#999999';
  }

  private getStatusBgColor(status: string): string {
    const statusMap: Record<string, string> = {
      active: '#E8F5E9',
      expired: '#FFEBEE',
      trial: '#FFF4E5',
      suspended: '#F5F5F5',
      pending: '#FFF4E5',
    };
    return statusMap[status.toLowerCase()] || '#F9F9F9';
  }
  showBranchStaffManagementDialog() {
    this.ref = this.dialogService.open(BranchStaffManagement, {
      header: 'إدارة مستخدمي الفرع',
      width: '502px',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        // Pass any data you want to the dialog
        userId: 123,
        context: 'subscription',
      },
    });

    // Subscribe to dialog close event
    this.ref!.onClose.subscribe((result) => {
      if (result) {
        console.log('Dialog closed with result:', result);
        // Handle the result data here
        this.handleDialogResult(result);
      }
    });
  }
  showAddNewSubscriberDialog() {
    this.ref = this.dialogService.open(AddNewSubscriber, {
      header: 'إضافة مشترك جديد',
      width: '502px',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        // Pass any data you want to the dialog
        userId: 123,
        context: 'subscription',
      },
    });

    // Subscribe to dialog close event
    this.ref!.onClose.subscribe((result) => {
      if (result) {
        console.log('Dialog closed with result:', result);
        // Handle the result data here
        this.handleDialogResult(result);
      }
    });
  }
  showBranchDetailsDialog() {
    this.ref = this.dialogService.open(BranchDetailsDialog, {
      header: 'تفاصيل الفرع',
      width: '707px',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        // Pass any data you want to the dialog
        userId: 123,
        context: 'subscription',
      },
    });

    // Subscribe to dialog close event
    this.ref!.onClose.subscribe((result) => {
      if (result) {
        console.log('Dialog closed with result:', result);
        // Handle the result data here
        this.handleDialogResult(result);
      }
    });
  }
  showTimelineOfEventsDialog() {
    this.ref = this.dialogService.open(TimelineOfEventsDialog, {
      header: 'الخط الزمني للأحداث',
      width: '784px',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        // Pass any data you want to the dialog
        userId: 123,
        context: 'subscription',
      },
    });

    // Subscribe to dialog close event
    this.ref!.onClose.subscribe((result) => {
      if (result) {
        console.log('Dialog closed with result:', result);
        // Handle the result data here
        this.handleDialogResult(result);
      }
    });
  }
  showSubscriptionPlanDialog() {
    this.ref = this.dialogService.open(SubscriptionPlanDialog, {
      header: 'خطة الاشتراك',
      width: '520px',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        // Pass any data you want to the dialog
        userId: 123,
        context: 'subscription',
      },
    });

    // Subscribe to dialog close event
    this.ref!.onClose.subscribe((result) => {
      if (result) {
        console.log('Dialog closed with result:', result);
        // Handle the result data here
        this.handleDialogResult(result);
      }
    });
  }

  handleDialogResult(result: any) {
    // Process the data returned from the dialog
    if (result && result.success) {
      // Refresh data or update UI
      console.log('Data saved successfully:', result.data);
    }
  }

  // Clean up on component destroy
  override ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
    super.ngOnDestroy();
  }

  copyToClipboard(phone: string) {
    navigator.clipboard.writeText(phone).then(() => {
      // alert('تم نسخ رقم الهاتف بنجاح');
    });
    // .catch(err => {
    //   console.error('فشل نسخ رقم الهاتف:', err);
    // });
  }

  onViewDetails(subscriptionId: number) {
    console.log('View details for subscription:', subscriptionId);
    this.showBranchDetailsDialog();
    // this.showSubscriptionPlanDialog();
  }
}
