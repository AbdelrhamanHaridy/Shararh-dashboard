import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { NotificationsService } from '../../services/notifications.service';
import { NotificationDetail } from '../../models/notification.model';

// Same icon-name -> asset mapping used on the list page. Keep both in sync
// until a shared icon map is factored out.
const ICON_MAP: Record<string, string> = {
  clock: 'assets/icons/global/timer.svg',
  cash: 'assets/icons/global/cash.svg',
};
const DEFAULT_ICON = 'assets/icons/global/timer.svg';

@Component({
  selector: 'app-notification-detail-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-detail-dialog.html',
  styleUrl: './notification-detail-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationDetailDialog implements OnInit {
  private notificationsService = inject(NotificationsService);
  private cdr = inject(ChangeDetectorRef);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);

  isLoading = signal(false);
  loadError = signal('');
  notification = signal<NotificationDetail | null>(null);
  iconPath = DEFAULT_ICON;

  ngOnInit() {
    const notificationId: string | undefined = this.config.data?.notificationId;

    if (!notificationId) {
      console.error('NotificationDetailDialog opened without a notificationId in dialog data');
      this.ref.close();
      return;
    }

    this.loadDetail(notificationId);
  }

  private loadDetail(id: string) {
    this.isLoading.set(true);
    this.loadError.set('');

    this.notificationsService.getNotificationDetail(id).subscribe({
      next: (res) => {
        const detail = res?.data?.notification ?? null;
        this.notification.set(detail);
        if (detail) {
          this.iconPath = ICON_MAP[detail.icon] ?? DEFAULT_ICON;
        }
        this.isLoading.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.loadError.set('تعذر تحميل تفاصيل الإشعار');
        this.cdr.markForCheck();
        console.error('Failed loading notification detail', err);
      },
    });
  }

  formatDate(dateStr: string | null): string {
    if (!dateStr) return '';
    const date = new Date(dateStr.replace(' ', 'T'));
    if (isNaN(date.getTime())) return '';
    const datePart = new Intl.DateTimeFormat('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
    const timePart = new Intl.DateTimeFormat('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
    return `${datePart} ، ${timePart}`;
  }

  closeDialog() {
    this.ref.close();
  }

  // No route/endpoint was given for navigating to the related lead/session/
  // subscription/etc. Wire this up once that's confirmed.
  goToRelatedItem() {
    const n = this.notification();
    if (!n) return;
    console.log('Navigate to related item:', n.action_type, n.action_id);
  }
}