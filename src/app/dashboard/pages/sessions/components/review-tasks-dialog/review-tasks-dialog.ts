import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';

@Component({
  selector: 'app-review-tasks-dialog',
  imports: [FormsModule, CheckboxModule],
  templateUrl: './review-tasks-dialog.html',
  styleUrl: './review-tasks-dialog.scss',
})
export class ReviewTasksDialog {
  selectedEntryIds = new Set<number>();

  communicationLog: any[] = [
    {
      id: 1,
      name: 'ارسال تقرير الجلسه اليومي',
      time: '10:45 ص',
      timeAgo: 'قبل ساعة',
      borderColor: '#10A922',
      direction: 'صادر',
      contactType: 'مكالمة هاتفية',
      reason: 'استفسار عن رصيد',
      channelIcon: 'pi pi-phone',
      iconBg: '#DBEAFE',
      iconColor: '#2563EB',
    },
    {
      id: 2,
      name: 'ارسال تقرير الجلسه اليومي',
      time: '04:20 م',
      timeAgo: '24 مايو',
      borderColor: '#16A34A',
      direction: 'وارد',
      contactType: 'واتساب',
      reason: 'تأكيد تحويل بنكي',
      channelIcon: 'pi pi-whatsapp',
      iconBg: '#DCFCE7',
      iconColor: '#16A34A',
    },
  ];

  toggleSelection(entryId: number): void {
    if (this.selectedEntryIds.has(entryId)) {
      this.selectedEntryIds.delete(entryId);
      return;
    }

    this.selectedEntryIds.add(entryId);
  }

  isSelected(entryId: number): boolean {
    return this.selectedEntryIds.has(entryId);
  }
}
