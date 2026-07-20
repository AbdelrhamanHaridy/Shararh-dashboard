import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { CustomizeTheUpdateMessageDialog } from '../customize-the-update-message-dialog/customize-the-update-message-dialog';

@Component({
  selector: 'app-admin-application-details-dialog',
  imports: [CommonModule],
  providers: [DialogService],
  templateUrl: './admin-application-details-dialog.html',
  styleUrl: './admin-application-details-dialog.scss',
})
export class AdminApplicationDetailsDialog {
  ref: DynamicDialogRef | null = null;

  constructor(private readonly dialogService: DialogService) {}

  application = {
    name: 'تفاصيل تطبيق الموظفين',
    organization: 'مؤسسة الشارق',
    currentVersion: 'V2.1.0',
    isOutdated: true,
    activeDevices: 1,
    totalDevices: 3,
  };

  onClose(): void {
    // TODO: close dialog
  }

  onNotifyUpdate(): void {
    // TODO: send an update-available notification to devices on this app
    this.onCustomizeTheUpdateMessageDialog(123, 'appId');
  }

  onForceUpdate(): void {
    // TODO: trigger a mandatory update rollout
  }
  onCustomizeTheUpdateMessageDialog(merchantId: number, appId: string): void {
    this.ref = this.dialogService.open(CustomizeTheUpdateMessageDialog, {
      width: '404px',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        merchantId,
        appId,
      },
    });
  }
}
