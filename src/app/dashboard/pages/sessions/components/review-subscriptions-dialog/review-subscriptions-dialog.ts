// review-subscriptions-dialog.ts
import { Component, inject } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';

interface SubscriptionReviewItem {
  id: number;
  customer_name: string;
  plan_type_label: string;
  duration: string;
  amount: number | string;
  payment_method_label: string;
  status_label: string;
  note?: string; // confirm against your actual model
}

@Component({
  selector: 'app-review-subscriptions-dialog',
  imports: [],
  templateUrl: './review-subscriptions-dialog.html',
  styleUrl: './review-subscriptions-dialog.scss',
})
export class ReviewSubscriptionsDialog {
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);

  subscriptions: SubscriptionReviewItem[] = this.config.data?.subscriptions ?? [];

  onConfirm(): void {
    this.ref.close(true);
  }
}