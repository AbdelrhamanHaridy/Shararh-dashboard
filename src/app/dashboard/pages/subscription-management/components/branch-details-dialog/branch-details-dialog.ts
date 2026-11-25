import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ToggleSwitch } from 'primeng/toggleswitch';
import { DynamicDialogConfig, DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { TimelineOfEventsDialog } from '../timeline-of-events-dialog/timeline-of-events-dialog';
import { SubscriptionPlanDialog } from '../subscription-plan-dialog/subscription-plan-dialog';
import { SubscriptionsService } from '../../services/subscriptions.service';
import { StoreDetails } from '../../../user-database/models/store-details.model';

type QuickActionKey = 'call' | 'whatsapp' | 'location' | 'plan';

interface BranchStat {
  key: QuickActionKey;
  label: string;
  iconSrc: string;
  bgColor: string;
}

@Component({
  selector: 'app-branch-details-dialog',
  imports: [CommonModule, FormsModule, ToggleSwitch],
  providers: [DialogService],
  templateUrl: './branch-details-dialog.html',
  styleUrl: './branch-details-dialog.scss',
})
export class BranchDetailsDialog implements OnInit {
  private readonly dialogService = inject(DialogService);
  private readonly config = inject(DynamicDialogConfig);
  private readonly subscriptionsService = inject(SubscriptionsService);
  private readonly destroyRef = inject(DestroyRef);

  ref: DynamicDialogRef | null = null;

  readonly storeId: number | null = this.config.data?.storeId ?? null;

  details = signal<StoreDetails | null>(null);
  isLoading = signal(true);
  loadError = signal(false);

  quickActions: BranchStat[] = [
    {
      key: 'call',
      label: 'اتصال',
      iconSrc: 'assets/icons/global/blue_outline_phone.svg',
      bgColor: '#137FEC26',
    },
    {
      key: 'whatsapp',
      label: 'واتساب',
      iconSrc: 'assets/icons/global/green_whatsapp.svg',
      bgColor: '#10A92226',
    },
    {
      key: 'location',
      label: 'الموقع',
      iconSrc: 'assets/icons/global/yellow_outline_location_mark.svg',
      bgColor: '#F1B31C26',
    },
    {
      key: 'plan',
      label: 'الخطه',
      iconSrc: 'assets/icons/global/white_outline_secure_check.svg',
      bgColor: '#2E3139',
    },
  ];

  // View model used by the template
  branch = computed(() => {
    const d = this.details();
    if (!d) return null;

    const sub = d.subscription;
    const lastActivation = [...(d.timeline ?? [])]
      .reverse()
      .find((e) => e.type === 'subscription_activated');

    return {
      id: d.store.id,
      name: d.store.name,
      subtitle: d.branches?.[0]?.name ?? d.store.address ?? '',
      avatarUrl: 'assets/testing/shop.jpg', // the API has no image field yet
      isActive: d.is_active,
      ownerName: d.owner?.name ?? 'غير محدد',
      subscriptionPlan: sub?.is_trial ? 'فترة تجريبية' : (sub?.plan?.name ?? 'غير محدد'),
      expiryDate: this.formatDate(sub?.ends_at),
      daysRemaining: sub?.days_left ?? 0,
      lastActivatedAt: lastActivation ? this.formatDateTime(lastActivation.created_at) : '-',
      // Not provided by this endpoint yet, shows "-" until the backend adds them
      usersCount: '-',
      activeUsersNow: '-',
    };
  });

  ngOnInit(): void {
    this.loadDetails();
  }

  loadDetails(): void {
    if (this.storeId === null) {
      this.isLoading.set(false);
      this.loadError.set(true);
      return;
    }

    this.isLoading.set(true);
    this.loadError.set(false);

    this.subscriptionsService
      .getStoreDetails(this.storeId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.details.set(res.data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching store details:', err);
          this.isLoading.set(false);
          this.loadError.set(true);
        },
      });
  }

  // ---------- Quick actions ----------
  isActionAvailable(key: QuickActionKey): boolean {
    const s = this.details()?.shortcuts;
    if (!s) return false;
    return key === 'plan' ? !!s.plan : !!s[key]?.action_url;
  }

  onQuickAction(key: QuickActionKey): void {
    const s = this.details()?.shortcuts;
    if (!s || !this.isActionAvailable(key)) return;

    switch (key) {
      case 'call':
        window.location.href = s.call.action_url; // tel:
        break;
      case 'whatsapp':
        window.open(s.whatsapp.action_url, '_blank', 'noopener');
        break;
      case 'location':
        window.open(s.location.action_url, '_blank', 'noopener');
        break;
      case 'plan':
        this.onOpenSubscriptionPlan();
        break;
    }
  }

  onToggleStatus(): void {
    // TODO: call the store activate / deactivate endpoint when it is available,
    // then update details() from the response.
  }

  onOpenSubscriptionPlan(): void {
    this.ref = this.dialogService.open(SubscriptionPlanDialog, {
      header: 'خطة الاشتراك',
      width: '520px',
      modal: true,
      closable: true,
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      data: {
        storeId: this.storeId,
        subscription: this.details()?.subscription,
      },
    });
  }

  onOpenTimeline(): void {
    this.ref = this.dialogService.open(TimelineOfEventsDialog, {
      header: 'الخط الزمني للأحداث',
      width: '784px',
      modal: true,
      closable: true,
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      data: {
        storeId: this.storeId,
        timeline: this.details()?.timeline ?? [],
      },
    });
  }

  // ---------- Helpers ----------
  private parseDate(value: string): Date {
    // "2026-12-01 10:00:00" -> ISO-like so every browser parses it
    return new Date(value.replace(' ', 'T'));
  }

  private formatDate(value?: string | null): string {
    return value ? this.parseDate(value).toLocaleDateString('ar-EG') : '-';
  }

  private formatDateTime(value: string): string {
    const d = this.parseDate(value);
    const date = d.toLocaleDateString('ar-EG');
    const time = d.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    return `${date} | ${time}`;
  }
}
