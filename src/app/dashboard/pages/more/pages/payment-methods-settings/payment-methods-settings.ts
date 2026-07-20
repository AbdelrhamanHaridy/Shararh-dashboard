import { Component, Type } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { MenuModule, Menu } from 'primeng/menu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditPaymentMethodEWalletDialog } from './components/edit-payment-method-e-wallet-dialog/edit-payment-method-e-wallet-dialog';
import { EditPaymentMethodFawryPayDialog } from './components/edit-payment-method-fawry-pay-dialog/edit-payment-method-fawry-pay-dialog';
import { EditPaymentMethodInstapayDialog } from './components/edit-payment-method-instapay-dialog/edit-payment-method-instapay-dialog';

type PaymentMethodType = 'default' | 'fawry' | 'eWallet' | 'instapay';

type PaymentMethod = {
  id: number;
  type: PaymentMethodType;
  name: string;
  time: string;
  data?: Array<{ name: string; value: string }>;
};

@Component({
  selector: 'app-payment-methods-settings',
  imports: [PageHeaderComponent, MenuModule],
  providers: [DialogService],
  templateUrl: './payment-methods-settings.html',
  styleUrl: './payment-methods-settings.scss',
})
export class PaymentMethodsSettings {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };
  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'إعدادات وسائل الدفع', routerLink: '/payment-methods-settings' },
  ];

  actionMenuItems: MenuItem[] = [
    {
      label: 'تعديل',
      icon: 'pi pi-pen-to-square',
      command: () => this.openEditDialogForActiveMethod(),
    },
    {
      label: 'تعطيل',
      icon: 'pi pi-ban',
      command: () => this.disableActiveMethod(),
    },
  ];

  ref: DynamicDialogRef | null = null;
  activeMethod: PaymentMethod | null = null;

  constructor(private readonly dialogService: DialogService) {}

  paymentMethods: PaymentMethod[] = [
    {
      id: 99,
      type: 'default',
      name: 'تفاصيل الخصم',
      time: 'تفعيل لحظي',
    },
    {
      id: 100,
      type: 'fawry',
      name: 'فوري باي',
      time: 'تفعيل لحظي',
    },
    {
      id: 101,
      type: 'eWallet',
      name: 'محفظه الكترونيه',
      time: 'تفعيل لحظي',
      data: [
        {
          name: 'رقم المحفظه',
          value: '01032060389',
        },
        {
          name: 'الاسم',
          value: 'عبدالله رفعت عبدالحميد',
        },
        {
          name: 'النسبه',
          value: '% 1',
        },
      ],
    },
    {
      id: 102,
      type: 'instapay',
      name: 'انستا باي',
      time: 'تفعيل لحظي',
      data: [
        {
          name: 'المرجع',
          value: 'abdallahsharara1',
        },
        {
          name: 'رقم الحساب',
          value: '207112774001',
        },
        {
          name: 'البنك',
          value: 'بنك الاسكندرية',
        },
        {
          name: 'المستفيد',
          value: 'عبدالله رفعت عبدالحميد',
        },
      ],
    },
    // {
    //   id: 102,
    //   name: 'صيدلية الشفاء',
    //   time: 'يستغرق يوم عمل 1 بعد استلام الاموال',
    //   apps: [
    //     {
    //       id: 'm102-a1',
    //       badgeLabel: 'محدث',
    //       badgeColor: '#065F46',
    //       badgeBgColor: '#ECFDF5',
    //       name: 'النقطة',
    //       devicesCount: 3,
    //       version: '2.0.1',
    //       iconUrl: 'assets/icons/global/blue_check.svg',
    //     },
    //   ],
    // },
    // {
    //   id: 103,
    //   name: 'مطعم الأصالة',
    //   time: 'المنطقة الصناعية',
    //   apps: [
    //     {
    //       id: 'm103-a1',
    //       badgeLabel: 'قيد التحديث',
    //       badgeColor: '#B45309',
    //       badgeBgColor: '#FFFAEB',
    //       name: 'خدمة الطلبات',
    //       devicesCount: 8,
    //       version: '1.0.0',
    //       iconUrl: 'assets/icons/global/blue_check.svg',
    //     },
    //   ],
    // },
  ];

  onActionButtonClick(event: MouseEvent, menu: Menu, method: PaymentMethod): void {
    this.activeMethod = method;
    menu.toggle(event);
  }

  openEditDialogForActiveMethod(): void {
    if (!this.activeMethod) {
      return;
    }

    const dialogByType: Record<PaymentMethodType, Type<unknown>> = {
      default: EditPaymentMethodFawryPayDialog,
      fawry: EditPaymentMethodFawryPayDialog,
      eWallet: EditPaymentMethodEWalletDialog,
      instapay: EditPaymentMethodInstapayDialog,
    };

    const headerByType: Record<PaymentMethodType, string> = {
      default: 'تعديل وسيلة الدفع',
      fawry: 'تعديل وسيلة الدفع',
      eWallet: 'تعديل وسيلة الدفع',
      instapay: 'تعديل وسيلة الدفع',
    };

    this.ref = this.dialogService.open(dialogByType[this.activeMethod.type], {
      header: headerByType[this.activeMethod.type],
      width: '520px',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        method: this.activeMethod,
      },
    });
  }

  disableActiveMethod(): void {
    if (!this.activeMethod) {
      return;
    }

    // Placeholder until backend integration for status changes.
    console.log('Disable payment method:', this.activeMethod);
  }
}
