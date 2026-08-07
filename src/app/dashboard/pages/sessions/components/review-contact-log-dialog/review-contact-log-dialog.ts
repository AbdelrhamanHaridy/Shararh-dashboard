import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
interface CommunicationEntry {
  id: number;
  name: string;
  time: string;
  timeAgo: string;
  borderColor: string;
  direction: string;
  contactType: string;
  reason: string;
  channelIcon: string;
  iconBg: string;
  iconColor: string;
}
@Component({
  selector: 'app-review-contact-log-dialog',
  imports: [FormsModule, CheckboxModule],
  templateUrl: './review-contact-log-dialog.html',
  styleUrl: './review-contact-log-dialog.scss',
})
export class ReviewContactLogDialog {
  selectedEntryIds = new Set<number>();

  communicationLog: CommunicationEntry[] = [
    {
      id: 1,
      name: 'أحمد محمد العتيبي',
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
      name: 'سارة خالد سليمان',
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
