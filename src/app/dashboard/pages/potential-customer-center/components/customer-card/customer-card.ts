import { Component, input, output } from '@angular/core';

export interface Customer {
  id: number;
  name: string;
  avatarUrl: string;
  status: string;
  statusColor: string;
  statusBgColor: string;
  city: string;
  country: string;
  acceptedDate: string;
  phone: string;
  assignedEmployee: string;
  notes: string;
}

@Component({
  selector: 'app-customer-card',
  templateUrl: './customer-card.html',
  styleUrl: './customer-card.scss',
})
export class CustomerCard {
  customer = input.required<Customer>();
  mode = input<'potential' | 'underImplementation'>('underImplementation');
  copyPhone = output<string>();
  changeStatus = output<number>();
  whatsappContact = output<number>();
  phoneCall = output<number>();
  acceptCustomer = output<number>();

  onCopyPhone() {
    this.copyPhone.emit(this.customer().phone);
  }

  onChangeStatus() {
    this.changeStatus.emit(this.customer().id);
  }

  onWhatsappContact() {
    this.whatsappContact.emit(this.customer().id);
  }

  onPhoneCall() {
    this.phoneCall.emit(this.customer().id);
  }

  onAcceptCustomer() {
    this.acceptCustomer.emit(this.customer().id);
  }
}
