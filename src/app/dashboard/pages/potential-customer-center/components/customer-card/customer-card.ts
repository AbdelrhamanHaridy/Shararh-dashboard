import { Component, input, output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

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
  standalone: true,
  imports: [ConfirmDialogModule],
  // NOTE: ConfirmationService is provided here so this component works
  // standalone in isolation/demos. If you render many <app-customer-card>
  // instances in a list, move ConfirmationService up to a shared ancestor
  // (e.g. the list/page component, or app.config.ts) instead — otherwise
  // every card gets its own isolated confirm-dialog instance.
  providers: [ConfirmationService],
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

  constructor(private confirmationService: ConfirmationService) {}

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
    this.confirmationService.confirm({
      accept: () => this.acceptCustomer.emit(this.customer().id),
    });
  }
}