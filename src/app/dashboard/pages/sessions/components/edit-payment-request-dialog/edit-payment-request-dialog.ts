import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SharedSelectComponent } from '../../../../shared/components/shared-select/shared-select.component';
type FilterKey = 'all' | 'communication' | 'subscriptions' | 'complaints';

@Component({
  selector: 'app-edit-payment-request-dialog',
  imports: [CommonModule, SharedSelectComponent],
  templateUrl: './edit-payment-request-dialog.html',
  styleUrl: './edit-payment-request-dialog.scss',
})
export class EditPaymentRequestDialog {
  packageOptions = [
    { label: 'باقة أساسية', value: 'basic' },
    { label: 'باقة النمو', value: 'growth' },
    { label: 'الباقة الشاملة', value: 'full' },
  ];

  durationOptions = [
    { label: 'شهري', value: 'monthly' },
    { label: 'نصف سنوي', value: 'semiAnnual' },
    { label: 'سنوي', value: 'annual' },
  ];

  filters: { key: FilterKey; label: string }[] = [
    { key: 'all', label: 'مكتمل' },
    { key: 'communication', label: 'قيد المراجعه' },
    { key: 'subscriptions', label: 'مرفوض' },
  ];

  selectedFilter: FilterKey = 'all';

  selectFilter(key: FilterKey): void {
    this.selectedFilter = key;
  }
}
