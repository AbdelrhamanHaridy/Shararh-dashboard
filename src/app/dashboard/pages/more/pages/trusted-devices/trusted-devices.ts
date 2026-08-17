import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { MenuItem, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ToastModule } from 'primeng/toast';
import { DevicesService } from './services/devices.service';
import { Device, DeviceApiResponse } from './models/device.model';

type DeviceTab = 'trust' | 'block';

@Component({
  selector: 'app-trusted-devices',
  imports: [PageHeaderComponent, BadgeModule, ToastModule],
  providers: [MessageService],
  templateUrl: './trusted-devices.html',
  styleUrl: './trusted-devices.scss',
})
export class TrustedDevices implements OnInit {
  private readonly devicesService = inject(DevicesService);
  private readonly messageService = inject(MessageService);

  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/home' };

  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'الأجهزة الموثوقة', routerLink: '/trusted-devices' },
  ];

  devices = signal<Device[]>([]);
  isLoading = signal(false);
  activeTab = signal<DeviceTab>('trust');
  actionInProgressId = signal<number | null>(null);
  showAll = signal(false);

  // Devices that still need a trust decision (new access requests)
  pendingDevices = computed(() => this.devices().filter((d) => !d.isTrusted && !d.isBlocked));

  // Devices shown in the lower list, filtered by the active tab
  filteredDevices = computed(() => {
    const all = this.devices();
    return this.activeTab() === 'trust'
      ? all.filter((d) => d.isTrusted && !d.isBlocked)
      : all.filter((d) => d.isBlocked);
  });

  totalCount = computed(() => this.devices().length);

  // Devices shown in the UI list (respects showAll toggle)
  visibleDevices = computed(() => {
    const list = this.filteredDevices();
    return this.showAll() ? list : list.slice(0, 2);
  });

  ngOnInit(): void {
    this.fetchDevices();
  }

  fetchDevices(): void {
    this.isLoading.set(true);
    this.devicesService.getDevices({ per_page: 91 }).subscribe({
      next: (response) => {
        const mapped = response.data.map((apiDevice) => this.mapApiDeviceToComponent(apiDevice));
        this.devices.set(mapped);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching devices:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل في تحميل الأجهزة',
        });
        this.isLoading.set(false);
      },
    });
  }

  private mapApiDeviceToComponent(apiDevice: DeviceApiResponse): Device {
    return {
      id: apiDevice.id,
      uuid: apiDevice.device_uuid,
      name: this.getDisplayName(apiDevice),
      platform: apiDevice.platform,
      browserLabel: this.getBrowserLabel(apiDevice),
      isOnline: apiDevice.is_online,
      isTrusted: apiDevice.is_trusted,
      isBlocked: apiDevice.is_blocked,
      lastIp: apiDevice.last_ip,
      location: apiDevice.last_location || apiDevice.last_ip || 'غير معروف',
      lastSeenLabel: this.getRelativeTime(apiDevice.last_seen_at),
      apiData: apiDevice,
    };
  }

  private getDisplayName(apiDevice: DeviceApiResponse): string {
    if (apiDevice.platform === 'web') {
      return `جهاز ويب (${this.parseBrowserName(apiDevice.device_name)})`;
    }
    return apiDevice.device_name;
  }

  private getBrowserLabel(apiDevice: DeviceApiResponse): string {
    if (apiDevice.platform === 'web') {
      return this.parseBrowserName(apiDevice.device_name);
    }
    const platformLabel =
      apiDevice.platform === 'android'
        ? 'Android'
        : apiDevice.platform === 'ios'
          ? 'iOS'
          : apiDevice.platform;
    return `${platformLabel} ${apiDevice.os_version}`;
  }

  private parseBrowserName(userAgent: string): string {
    if (/Edg\//.test(userAgent)) return 'Microsoft Edge';
    if (/Chrome\//.test(userAgent)) return 'Chrome Browser';
    if (/Firefox\//.test(userAgent)) return 'Firefox';
    if (/Safari\//.test(userAgent) && !/Chrome/.test(userAgent)) return 'Safari';
    return 'متصفح غير معروف';
  }

  private getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);

    if (diffMinutes < 1) return 'الآن';
    if (diffMinutes < 60) return `منذ ${diffMinutes} دقيقة`;

    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;

    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return 'أمس';
    if (diffDays < 30) return `منذ ${diffDays} يوم`;

    return date.toLocaleDateString('ar-EG');
  }

  getDeviceIcon(platform: string): string {
    if (platform === 'web') return 'assets/icons/global/laptop.svg';
    return 'assets/icons/global/green_phone.svg';
  }

  setActiveTab(tab: DeviceTab): void {
    this.activeTab.set(tab);
  }

  toggleShowAll(): void {
    this.showAll.set(!this.showAll());
  }

  trustDevice(device: Device): void {
    this.actionInProgressId.set(device.id);
    this.devicesService.trustDevice(device.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'نجح',
          detail: 'تم توثيق الجهاز بنجاح',
        });
        this.fetchDevices();
        this.actionInProgressId.set(null);
      },
      error: (error) => {
        console.error('Error trusting device:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل في توثيق الجهاز',
        });
        this.actionInProgressId.set(null);
      },
    });
  }

  untrustDevice(device: Device): void {
    this.actionInProgressId.set(device.id);
    this.devicesService.untrustDevice(device.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'نجح',
          detail: 'تم إلغاء توثيق الجهاز',
        });
        this.fetchDevices();
        this.actionInProgressId.set(null);
      },
      error: (error) => {
        console.error('Error untrusting device:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل في إلغاء توثيق الجهاز',
        });
        this.actionInProgressId.set(null);
      },
    });
  }

  blockDevice(device: Device): void {
    if (!confirm(`هل تريد حظر وصول الجهاز "${device.name}"؟`)) {
      return;
    }

    this.actionInProgressId.set(device.id);
    this.devicesService.blockDevice(device.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'نجح',
          detail: 'تم حظر الجهاز بنجاح',
        });
        this.fetchDevices();
        this.actionInProgressId.set(null);
      },
      error: (error) => {
        console.error('Error blocking device:', error);
        this.messageService.add({ severity: 'error', summary: 'خطأ', detail: 'فشل في حظر الجهاز' });
        this.actionInProgressId.set(null);
      },
    });
  }

  unblockDevice(device: Device): void {
    this.actionInProgressId.set(device.id);
    this.devicesService.unblockDevice(device.id).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'نجح',
          detail: 'تم رفع الحظر عن الجهاز',
        });
        this.fetchDevices();
        this.actionInProgressId.set(null);
      },
      error: (error) => {
        console.error('Error unblocking device:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل في رفع الحظر عن الجهاز',
        });
        this.actionInProgressId.set(null);
      },
    });
  }
}
