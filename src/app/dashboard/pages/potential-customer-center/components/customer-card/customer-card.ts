import { Component, input, output } from '@angular/core';
import { Confirmation, ConfirmationService, MenuItem } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';
import { LeadActions } from '../../models/potential-customer-center.model';

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
  actions: LeadActions;
}
interface ConfirmationWithData extends Confirmation {
  data?: {
    prefix: string;
    name: string;
    suffix: string;
  };
}
@Component({
  selector: 'app-customer-card',
  standalone: true,
  imports: [ConfirmDialogModule, MenuModule],
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
  deleteCustomer = output<number>();
  archiveCustomer = output<number>();
  assignEmployee = output<number>();
  editCustomer = output<number>();

  constructor(private confirmationService: ConfirmationService) {}

  get menuItems(): MenuItem[] {
    const actions = this.customer().actions;
    const items: MenuItem[] = [
      {
        label: 'تغيير الحالة',
        command: () => this.onChangeStatus(),
      },
      {
        label: 'تعديل',
        command: () => this.onEdit(),
      },
      {
        label: 'حذف',
        command: () => this.onDelete(),
      },
    ];

    if (actions.can_assign) {
      items.push({
        label: 'تعيين المسؤول',
        command: () => this.onAssignEmployee(),
      });
    }

    if (actions.can_archive) {
      items.push({
        label: 'أرشفة',
        command: () => this.onArchive(),
      });
    }

    return items;
  }

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

  onMenuToggle(menu: Menu, event: MouseEvent) {
    menu.toggle(event);
  }

  onEdit() {
    this.editCustomer.emit(this.customer().id);
  }

  onAcceptCustomer() {
    this.confirmationService.confirm({
      data: {
        prefix: 'هل تؤكد استلام العميل',
        name: this.customer().name,
        suffix: '؟',
      },
      accept: () => this.acceptCustomer.emit(this.customer().id),
    } as ConfirmationWithData);
  }

  onDelete() {
    this.confirmationService.confirm({
      data: {
        prefix: 'هل أنت متأكد من حذف العميل',
        name: this.customer().name,
        suffix: '؟',
      },
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => this.deleteCustomer.emit(this.customer().id),
    } as ConfirmationWithData);
  }

  onArchive() {
    this.confirmationService.confirm({
      data: {
        prefix: 'هل تريد نقل العميل',
        name: this.customer().name,
        suffix: 'للأرشيف؟',
      },
      header: 'تأكيد الأرشفة',
      icon: 'pi pi-archive',
      acceptLabel: 'نعم',
      rejectLabel: 'لا',
      accept: () => this.archiveCustomer.emit(this.customer().id),
    } as ConfirmationWithData);
  }
  onAssignEmployee() {
    this.assignEmployee.emit(this.customer().id);
  }
}
