import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { TimelineOfEventsDialog } from '../timeline-of-events-dialog/timeline-of-events-dialog';
import { SubscriptionPlanDialog } from '../subscription-plan-dialog/subscription-plan-dialog';

interface BranchStat {
  label: string;
  iconSrc: string;
  bgColor: string;
}

@Component({
  selector: 'app-branch-details-dialog',
  imports: [CommonModule, ToggleSwitch],
  providers: [DialogService],
  templateUrl: './branch-details-dialog.html',
  styleUrl: './branch-details-dialog.scss',
})
export class BranchDetailsDialog {
  ref: DynamicDialogRef | null = null;

  constructor(private readonly dialogService: DialogService) {}

  branch = {
    id: 1,
    name: 'محل الحرمين',
    subtitle: 'فرع وسط المدينة (الرئيسي)',
    avatarUrl: 'assets/testing/shop.jpg',
    isOnline: true,
    expiryDate: '30-12-2024',
    daysRemaining: 72,
    usersCount: 12,
    activeUsersNow: 4,
    ownerName: 'احمد محمد',
    subscriptionPlan: 'فتره تجربيه',
    lastActivatedAt: '25-10-2023 | 22:00',
    isActive: true,
  };

  quickActions: BranchStat[] = [
    { label: 'اتصال', iconSrc: 'assets/icons/global/blue_outline_phone.svg', bgColor: '#137FEC26' },
    { label: 'واتساب', iconSrc: 'assets/icons/global/green_whatsapp.svg', bgColor: '#10A92226' },
    {
      label: 'الموقع',
      iconSrc: 'assets/icons/global/yellow_outline_location_mark.svg',
      bgColor: '#F1B31C26',
    },
    {
      label: 'الخطه',
      iconSrc: 'assets/icons/global/white_outline_secure_check.svg',
      bgColor: '#2E3139',
    },
  ];

  onEdit(): void {
    // TODO: navigate to / open edit branch form
  }

  onClose(): void {
    // TODO: close dialog
  }

  onToggleStatus(): void {
    this.branch.isActive = !this.branch.isActive;
    // TODO: call API to activate / deactivate branch
  }

  onOpenSubscriptionPlan(): void {
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
        userId: 123,
        context: 'subscription',
      },
    });
  }

  onOpenTimeline(): void {
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
        storeId: this.branch.id,
      },
    });
  }
}
