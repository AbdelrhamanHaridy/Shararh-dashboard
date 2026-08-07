import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { TimelineService, TimelineEventResponse } from '../../services/timeline.service';
import { BaseComponent } from '../../../../shared/services/base.component';
import { takeUntil } from 'rxjs';

type EventCategory = 'account' | 'subscriptions' | 'communication' | 'complaints' | 'suggestions';
type FilterKey = 'all' | 'communication' | 'subscriptions' | 'complaints';

interface SentencePart {
  text: string;
  bold?: boolean;
  color?: string;
}

interface InlineDetail {
  label: string;
  value: string;
  icon?: string;
}

interface TimelineEvent {
  id: number;
  category: EventCategory;

  // Circle icon on the connecting line
  icon: string;
  iconBg: string;
  borderColor: string;

  // Top row: badge (always shown) + date
  badgeLabel: string;
  badgeBg: string;
  badgeColor: string;
  date: string;

  // Optional secondary title, only for events that need one in addition to the badge
  title?: string;

  // Simple description + optional colored/bold highlighted segment (e.g. a person's name)
  description?: string;
  descriptionHighlight?: string;
  descriptionHighlightColor?: string;

  // Trailing icon shown after the description (complaint / suggestion cards)
  descriptionIcon?: string;
  descriptionIconColor?: string;

  // Composed inline sentence with mixed plain/bold/colored segments (subscription card)
  sentence?: SentencePart[];

  // Two details shown side by side (communication card)
  detailsInline?: InlineDetail[];

  // Quoted note box
  quote?: string;
}

@Component({
  selector: 'app-timeline-of-events-dialog',
  imports: [CommonModule],
  templateUrl: './timeline-of-events-dialog.html',
  styleUrl: './timeline-of-events-dialog.scss',
})
export class TimelineOfEventsDialog extends BaseComponent implements OnInit {
  private timelineService = inject(TimelineService);
  private dialogRef = inject(DynamicDialogRef);
  private dialogConfig = inject(DynamicDialogConfig);

  filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'الكل' },
    { key: 'communication', label: 'تواصل' },
    { key: 'subscriptions', label: 'اشتراكات' },
    { key: 'complaints', label: 'شكاوي' },
  ];

  selectedFilter = signal<FilterKey>('all');
  events = signal<TimelineEvent[]>([]);
  isLoading = signal(false);

  filteredEvents = computed(() => {
    const selectedKey = this.selectedFilter();
    const allEvents = this.events();
    if (selectedKey === 'all') {
      return allEvents;
    }
    return allEvents.filter((event) => event.category === selectedKey);
  });

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.loadTimeline();
  }

  private loadTimeline(): void {
    const storeId = this.dialogConfig.data?.storeId;
    if (!storeId) {
      console.warn('No storeId provided to timeline dialog');
      return;
    }

    this.isLoading.set(true);
    this.timelineService
      .getStoreTimeline(storeId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const mappedEvents = res.data.map((event) => this.mapApiEventToTimelineEvent(event));
          this.events.set(mappedEvents);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error fetching timeline:', err);
          this.isLoading.set(false);
        },
      });
  }

  private mapApiEventToTimelineEvent(event: TimelineEventResponse): TimelineEvent {
    const colorMap: Record<string, { bg: string; border: string; text: string }> = {
      green: {
        bg: 'bg-[#DCFCE7]',
        border: '#10A922',
        text: 'text-[#15803D]',
      },
      orange: {
        bg: 'bg-[#FEF3C7]',
        border: '#F59E0B',
        text: 'text-[#B45309]',
      },
      red: {
        bg: 'bg-[#FEE2E2]',
        border: '#EF4444',
        text: 'text-[#DC2626]',
      },
      blue: {
        bg: 'bg-[#DBEAFE]',
        border: '#3B82F6',
        text: 'text-[#1E40AF]',
      },
      purple: {
        bg: 'bg-[#FCE7F3]',
        border: '#EC4899',
        text: 'text-[#DB2777]',
      },
    };

    const iconMap: Record<string, string> = {
      upload: 'assets/icons/global/green_wallet.svg',
      download: 'assets/icons/global/download.svg',
      check: 'assets/icons/global/green_check.svg',
      warning: 'assets/icons/global/warning.svg',
      info: 'assets/icons/global/info.svg',
      payment: 'assets/icons/global/payment.svg',
      chat: 'assets/icons/global/grey_chat.svg',
      lamp: 'assets/icons/global/lamp.svg',
    };

    const colors = colorMap[event.color] || colorMap['blue'];
    const iconPath = iconMap[event.icon] || 'assets/icons/global/info.svg';

    // Map event type to category
    const categoryMap: Record<string, EventCategory> = {
      payment_submitted: 'subscriptions',
      payment_confirmed: 'subscriptions',
      subscription_activated: 'subscriptions',
      subscription_expired: 'subscriptions',
      communication: 'communication',
      complaint: 'complaints',
      suggestion: 'suggestions',
      account_created: 'account',
    };

    const category: EventCategory = categoryMap[event.type] || 'account';

    return {
      id: event.id,
      category,
      icon: iconPath,
      iconBg: colors.bg,
      borderColor: colors.border,
      badgeLabel: event.title,
      badgeBg: colors.bg,
      badgeColor: colors.text,
      date: new Date(event.created_at).toLocaleDateString('ar-EG', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      description: event.description,
      descriptionHighlight: event.performed_by?.name || undefined,
      descriptionHighlightColor: colors.border,
    };
  }

  selectFilter(key: FilterKey): void {
    this.selectedFilter.set(key);
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
