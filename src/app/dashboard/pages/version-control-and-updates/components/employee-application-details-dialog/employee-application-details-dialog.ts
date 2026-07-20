import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-employee-application-details-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './employee-application-details-dialog.html',
  styleUrl: './employee-application-details-dialog.scss',
})
export class EmployeeApplicationDetailsDialog {
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
  }

  onForceUpdate(): void {
    // TODO: trigger a mandatory update rollout
  }
}