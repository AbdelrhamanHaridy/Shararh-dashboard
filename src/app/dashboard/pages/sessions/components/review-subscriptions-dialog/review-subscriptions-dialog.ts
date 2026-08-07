import { Component } from '@angular/core';

interface SubscriptionReviewRow {
  note: string;
  paymentStatus: string;
  paymentMethod: string;
  customer: string;
}

@Component({
  selector: 'app-review-subscriptions-dialog',
  imports: [],
  templateUrl: './review-subscriptions-dialog.html',
  styleUrl: './review-subscriptions-dialog.scss',
})
export class ReviewSubscriptionsDialog {
  readonly subscriptionRows: SubscriptionReviewRow[] = [
    {
      note: 'تم تأكيد التحويل بعد المراجعة',
      paymentStatus: 'مكتمل',
      paymentMethod: 'بطاقة بنكية',
      customer: 'محمد أحمد',
    },
    {
      note: 'بانتظار التأكيد من فريق المالية',
      paymentStatus: 'قيد المراجعة',
      paymentMethod: 'تحويل بنكي',
      customer: 'سارة خالد',
    },
    {
      note: 'تم إرسال تذكير بالدفع',
      paymentStatus: 'معلق',
      paymentMethod: 'نقدي',
      customer: 'أحمد علي',
    },
  ];
}
