import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NotificationsService } from './services/notifications.service';
import { NotificationItem } from './models/notification.model';
import { NotificationDetailDialog } from './components/notification-detail-dialog/notification-detail-dialog';

interface NotificationView {
  id: string;
  iconPath: string;
  title: string;
  message: string;
  timeAgo: string;
  isRead: boolean;
  primaryLabel: string;
  secondaryLabel: string;
  actionType: string;
  actionId: number | null;
}

const ICON_MAP: Record<string, string> = {
  lead_assigned: 'assets/icons/global/green_add_user.svg',
  lead_status_changed: 'assets/icons/global/green_check.svg',
  follow_up_reminder: 'assets/icons/global/clock.svg',
  session_reviewed: 'assets/icons/global/green_clipboard.svg',
  points_awarded: 'assets/icons/global/star.svg',
  subscription_created: 'assets/icons/global/cash.svg',
  customer_request_created: 'assets/icons/global/clipboard.svg',
  system_update: 'assets/icons/global/thunder.svg',
};
const DEFAULT_ICON = 'assets/icons/global/notification.svg';

const ACTION_LABEL_MAP: Record<string, { primary: string; secondary: string }> = {
  lead_assigned: { primary: 'عرض العميل المحتمل', secondary: 'تجاهل' },
  lead_status_changed: { primary: 'عرض التفاصيل', secondary: 'تجاهل' },
  follow_up_reminder: { primary: 'مراجعة الجلسه', secondary: 'تجاهل' },
  session_reviewed: { primary: 'عرض المراجعة', secondary: 'تجاهل' },
  points_awarded: { primary: 'عرض النقاط', secondary: 'تجاهل' },
  subscription_created: { primary: 'عرض الاشتراك', secondary: 'تجاهل' },
  customer_request_created: { primary: 'عرض الطلب', secondary: 'تجاهل' },
  system_update: { primary: 'عرض التحديث', secondary: 'تجاهل' },
};
const DEFAULT_ACTION_LABELS = { primary: 'عرض التفاصيل', secondary: 'تجاهل' };

@Component({
  selector: 'app-notifications',
  imports: [PageHeaderComponent, CommonModule],
  providers: [DialogService],
  templateUrl: './notifications.html',
  styleUrl: './notifications.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Notifications implements OnInit {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };
  breadcrumbItems: MenuItem[] = [{ label: 'الإشعارات', routerLink: '/notifications' }];

  isLoading = false;
  loadError = '';
  notifications: NotificationView[] = [];

  private ref: DynamicDialogRef | null = null;

  constructor(
    private notificationsService: NotificationsService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  private loadNotifications() {
    this.isLoading = true;
    this.loadError = '';
    this.notificationsService.getNotifications().subscribe({
      next: (res) => {
        if (res && Array.isArray(res.data)) {
          this.notifications = res.data.map((n) => this.mapNotification(n));
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.loadError = 'تعذر تحميل الإشعارات';
        this.cdr.markForCheck();
        console.error('Failed loading notifications', err);
      },
    });
  }

  private mapNotification(n: NotificationItem): NotificationView {
    // const labels = ACTION_LABEL_MAP[n.type] ?? DEFAULT_ACTION_LABELS;
    return {
      id: n.id,
      iconPath: ICON_MAP[n.type] ?? DEFAULT_ICON,
      title: n.title,
      message: n.message,
      timeAgo: this.relativeTime(n.created_at),
      isRead: n.is_read,
      primaryLabel: 'عرض التفاصيل',
      secondaryLabel: 'تجاهل',
      actionType: n.action_type,
      actionId: n.action_id,
    };
  }

  private relativeTime(dateStr: string): string {
    const date = new Date(dateStr.replace(' ', 'T'));
    const diffMs = Date.now() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'الآن';
    if (mins < 60) return `منذ ${mins} دقيقة`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
  }

  openDetail(notification: NotificationView) {
    this.ref = this.dialogService.open(NotificationDetailDialog, {
      header: 'تفاصيل الإشعار',
      width: '480px',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: { notificationId: notification.id },
    });
  }

  onPrimaryAction(notification: NotificationView) {
    this.openDetail(notification);
  }

  onDismiss(notification: NotificationView) {
    this.notificationsService.markAsRead(notification.id).subscribe({
      next: () => {
        notification.isRead = true;
        this.cdr.markForCheck();
      },
      error: (err) => console.error('Failed to mark notification as read', err),
    });
  }
}
