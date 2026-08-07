import { Component, input, output } from '@angular/core';

export interface Subscription {
  id: number;
  status: string;
  statusColor: string;
  statusBgColor: string;
  merchantName: string;
  ownerName: string;
  isTrial: boolean;
  planName: string;
  subscriptionType: string;
  officesCount: number;
  phone: string;
  location: string;
  paymentGateway: string;
  merchantType: string;
  displayDate: string;
  actionDate: string;
}

@Component({
  selector: 'app-subscription-card',
  templateUrl: './subscription-card.html',
  styleUrl: './subscription-card.scss',
})
export class SubscriptionCard {
  subscription = input.required<Subscription>();
  copyPhone = output<string>();
  viewDetails = output<number>();

  onCopyPhone() {
    this.copyPhone.emit(this.subscription().phone);
  }

  onViewDetails() {
    this.viewDetails.emit(this.subscription().id);
  }
}
