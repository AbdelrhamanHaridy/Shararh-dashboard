import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

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
export class TimelineOfEventsDialog {
  filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'الكل' },
    { key: 'communication', label: 'تواصل' },
    { key: 'subscriptions', label: 'اشتراكات' },
    { key: 'complaints', label: 'شكاوي' },
  ];

  selectedFilter: FilterKey = 'all';

  events: TimelineEvent[] = [
    {
      id: 1,
      category: 'account',
      icon: 'assets/icons/global/green_add_user.svg',
      iconBg: 'bg-[#DCFCE7]',
      borderColor: '#10A922',
      badgeLabel: 'تسجيل الحساب',
      badgeBg: 'bg-[#DCFCE7]',
      badgeColor: 'text-[#15803D]',
      date: '12 يناير 2023 - 10:30 ص',
      description: 'تم تسجيل الحساب عبر رابط الاحالة للموظف',
      descriptionHighlight: 'محمد أحمد',
      descriptionHighlightColor: '#16A34A',
    },
    {
      id: 2,
      category: 'subscriptions',
      icon: 'assets/icons/global/green_check.svg',
      iconBg: 'bg-[#DCFCE7]',
      borderColor: '#0D7F1A',
      badgeLabel: 'تفعيل باقة',
      badgeBg: 'bg-[#FEF3C7]',
      badgeColor: 'text-[#B45309]',
      date: '15 فبراير 2023 - 02:15 م',
      title: 'تفعيل باقة بريميوم - سنة كاملة',
      sentence: [
        { text: 'تم التفعيل لـ ' },
        { text: 'صيدلية الشفاء', color: '#191D17' },
        { text: ' مقابل مبلغ ' },
        { text: 'EGP 500', color: '#0D7F1A' },
        { text: ' ، طريقة الدفع ' },
        { text: 'محفظة إلكترونية', color: '#191D17' },
      ],
    },
    {
      id: 3,
      category: 'communication',
      icon: 'assets/icons/global/grey_chat.svg',
      iconBg: 'bg-[#DBEAFE]',
      borderColor: '#72796E',
      badgeLabel: 'تواصل خدمة العملاء',
      badgeBg: 'bg-[#F1F5F4]',
      badgeColor: 'text-[#5A6355]',
      date: '20 مارس 2023 - 09:45 ص',
      detailsInline: [
        { label: 'نوع التواصل', value: 'صادر (واتساب)', icon: 'pi pi-arrow-up-right' },
        { label: 'السبب', value: 'استفسار عن مديونية', icon: 'pi pi-info-circle' },
      ],
      quote: 'ملاحظة: العميل يحتاج رد سريع',
    },
    {
      id: 4,
      category: 'complaints',
      icon: 'assets/icons/global/warning.svg',
      iconBg: 'bg-[#FEE2E2]',
      borderColor: '#BA1A1A',
      badgeLabel: 'تقديم شكوى',
      badgeBg: 'bg-[#FEE2E2]',
      badgeColor: 'text-[#DC2626]',
      date: '05 يوليو 2023 - 11:20 ص',
      title: 'تفاصيل الشكوى:',
      description: 'تأخير في معالجة طلب تحويل لتغيير الراتب لشهر يناير.',
      descriptionIcon: 'pi pi-exclamation-triangle',
      descriptionIconColor: '#DC2626',
    },
    {
      id: 5,
      category: 'suggestions',
      icon: 'assets/icons/global/lamp.svg',
      iconBg: 'bg-[#FCE7F3]',
      borderColor: '#8E495F',
      badgeLabel: 'تقديم مقترح',
      badgeBg: 'bg-[#FCE7F3]',
      badgeColor: 'text-[#DB2777]',
      date: '12 أغسطس 2023 - 04:50 م',
      title: 'تفاصيل المقترح:',
      description: 'إضافة خيار الدفع عبر خدمة انستاباي لتسهيل العمليات.',
      descriptionIcon: 'pi pi-lightbulb',
      descriptionIconColor: '#DB2777',
    },
  ];

  get filteredEvents(): TimelineEvent[] {
    if (this.selectedFilter === 'all') {
      return this.events;
    }
    return this.events.filter((event) => event.category === this.selectedFilter);
  }

  selectFilter(key: FilterKey): void {
    this.selectedFilter = key;
  }

  onClose(): void {
    // TODO: close dialog
  }
}
