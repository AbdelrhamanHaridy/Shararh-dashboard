import { Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SharedKpiCard } from '../../shared/components/shared-kpi-card/shared-kpi-card';
import { MenuItem } from 'primeng/api';
import { SubscriptionCard } from './components/subscription-card/subscription-card';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { BranchStaffManagement } from './components/branch-staff-management/branch-staff-management';
import { AddNewSubscriber } from './components/add-new-subscriber/add-new-subscriber';

@Component({
  selector: 'app-subscription-management',
  imports: [SharedKpiCard, PageHeaderComponent, SubscriptionCard, BranchStaffManagement],
  providers: [DialogService],
  templateUrl: './subscription-management.html',
  styleUrl: './subscription-management.scss',
})
export class SubscriptionManagement implements OnInit {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };
  breadcrumbItems = [{ label: 'إدارة الاشتراكات' }];

  ref: DynamicDialogRef | null = null;

  constructor(public dialogService: DialogService) {}
  ngOnInit() {}
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

  handleDialogResult(result: any) {
    // Process the data returned from the dialog
    if (result && result.success) {
      // Refresh data or update UI
      console.log('Data saved successfully:', result.data);
    }
  }

  // Clean up on component destroy
  ngOnDestroy() {
    if (this.ref) {
      this.ref.close();
    }
  }
  subscriptions = [
    {
      id: 5,
      status: 'نشطة',
      statusColor: '#10A922',
      statusBgColor: '#E8F5E9',
      merchantName: 'محل الحرمين',
      ownerName: 'أحمد محمد',
      isTrial: true,
      planName: '',
      subscriptionType: 'فتره تجريبيه',
      officesCount: 0,
      phone: '+20 122 345 6789',
      location: 'غير محدد',
      paymentGateway: 'غير محدد',
      merchantType: '20 جهاز',
      displayDate: '30-12-2024',
      actionDate: '30-12-2024',
    },
    {
      id: 1,
      status: 'نشطة',
      statusColor: '#10A922',
      statusBgColor: '#E8F5E9',
      merchantName: 'صيدلية الشفاء',
      ownerName: 'أريج مصطفى',
      isTrial: false,
      planName: 'باقة النمو',
      subscriptionType: 'اشتراك سنوي',
      officesCount: 3,
      phone: '+20 123 456 789',
      location: 'المحلة الشرقي',
      paymentGateway: 'غير محدد',
      merchantType: 'شريك تجاري',
      displayDate: '30-12-2024',
      actionDate: '30-12-2024',
    },
    {
      id: 2,
      status: 'قيد الانتظار',
      statusColor: '#FF9500',
      statusBgColor: '#FFF4E5',
      merchantName: 'محل المزارعين',
      ownerName: 'أحمد محمد',
      isTrial: false,
      planName: 'باقة الأساسية',
      subscriptionType: 'اشتراك شهري',
      officesCount: 1,
      phone: '+20 123 345 6789',
      location: 'المحلة الشرقي',
      paymentGateway: 'غير محدد',
      merchantType: 'شريك تجاري',
      displayDate: '30-12-2024',
      actionDate: '30-12-2024',
    },
    {
      id: 3,
      status: 'نشطة',
      statusColor: '#10A922',
      statusBgColor: '#E8F5E9',
      merchantName: 'مطعم الأصالة',
      ownerName: 'محمد الشمري',
      isTrial: false,
      planName: 'باقة النمو',
      subscriptionType: 'اشتراك سنوي',
      officesCount: 2,
      phone: '+20 123 456 789',
      location: 'المحلة الشرقي',
      paymentGateway: 'غير محدد',
      merchantType: 'شريك تجاري',
      displayDate: '30-12-2024',
      actionDate: '30-12-2024',
    },
  ];

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
    // Add navigation logic here
  }
}
