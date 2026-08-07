import { Component, Type, OnInit, signal, inject } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { MenuModule, Menu } from 'primeng/menu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { EditPaymentMethodEWalletDialog } from './components/edit-payment-method-e-wallet-dialog/edit-payment-method-e-wallet-dialog';
import { EditPaymentMethodFawryPayDialog } from './components/edit-payment-method-fawry-pay-dialog/edit-payment-method-fawry-pay-dialog';
import { EditPaymentMethodInstapayDialog } from './components/edit-payment-method-instapay-dialog/edit-payment-method-instapay-dialog';
import { PaymentMethodsService } from './services/payment-methods-settings.service';
import { PaymentMethod, PaymentMethodApiResponse } from './models/payment-methods-settings.model';
import { AddPaymentMethodDialog } from './components/add-payment-method-dialog/add-payment-method-dialog';

@Component({
  selector: 'app-payment-methods-settings',
  imports: [PageHeaderComponent, MenuModule, ConfirmDialogModule],
  providers: [DialogService, MessageService, ConfirmationService],
  templateUrl: './payment-methods-settings.html',
  styleUrl: './payment-methods-settings.scss',
})
export class PaymentMethodsSettings implements OnInit {
  private readonly paymentMethodsService = inject(PaymentMethodsService);
  private readonly dialogService = inject(DialogService);
  private readonly messageService = inject(MessageService);
  private readonly confirmationService = inject(ConfirmationService);

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
    {
      label: 'حذف',
      icon: 'pi pi-trash',
      command: () => this.deleteActiveMethod(),
    },
  ];

  ref: DynamicDialogRef | null = null;
  activeMethod: PaymentMethod | null = null;
  paymentMethods = signal<PaymentMethod[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.fetchPaymentMethods();
  }

  fetchPaymentMethods(): void {
    this.isLoading.set(true);
    this.paymentMethodsService.getPaymentMethods().subscribe({
      next: (response) => {
        const methods = response.data.payment_methods.map((apiMethod) =>
          this.mapApiMethodToComponent(apiMethod),
        );
        this.paymentMethods.set(methods);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error fetching payment methods:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل في تحميل وسائل الدفع',
        });
        this.isLoading.set(false);
      },
    });
  }

  private mapApiMethodToComponent(apiMethod: PaymentMethodApiResponse): PaymentMethod {
    const data = apiMethod.configs.map((config) => ({
      name: config.label,
      value: config.value?.toString() || '',
    }));

    return {
      id: apiMethod.id,
      type: apiMethod.type,
      name: apiMethod.name,
      time: apiMethod.processing_time || 'غير محدد',
      data: data.length > 0 ? data : undefined,
      isActive: apiMethod.is_active,
      hasFees: apiMethod.has_fees,
      feesPercentage: apiMethod.fees_percentage,
      apiData: apiMethod,
    };
  }

  constructor() {}

  onActionButtonClick(event: MouseEvent, menu: Menu, method: PaymentMethod): void {
    this.activeMethod = method;
    // Update the toggle menu label based on current isActive state
    const toggleLabel = this.activeMethod.isActive ? 'تعطيل' : 'تفعيل';
    if (this.actionMenuItems && this.actionMenuItems.length > 1) {
      this.actionMenuItems[1] = { ...this.actionMenuItems[1], label: toggleLabel };
    }
    menu.toggle(event);
  }

  openEditDialogForActiveMethod(): void {
    if (!this.activeMethod) {
      return;
    }

    const dialogByType: Record<string, Type<unknown>> = {
      fawry: EditPaymentMethodFawryPayDialog,
      wallet: EditPaymentMethodEWalletDialog,
      eWallet: EditPaymentMethodEWalletDialog,
      instapay: EditPaymentMethodInstapayDialog,
      instapay_handle: EditPaymentMethodInstapayDialog,
      bank_transfer: EditPaymentMethodInstapayDialog,
      card: EditPaymentMethodFawryPayDialog,
      default: EditPaymentMethodFawryPayDialog,
    };

    const Dialog = dialogByType[this.activeMethod.type] || EditPaymentMethodFawryPayDialog;

    this.ref = this.dialogService.open(Dialog, {
      header: 'تعديل وسيلة الدفع',
      width: '520px',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        method: this.activeMethod,
        apiData: this.activeMethod.apiData,
      },
    });

    if (this.ref) {
      this.ref.onClose.subscribe((result) => {
        if (result?.success) {
          this.updatePaymentMethod(result.data);
        }
      });
    }
  }

  private updatePaymentMethod(formData: any): void {
    if (!this.activeMethod?.apiData) {
      return;
    }

    const payload = {
      name: formData.paymentMethodName || this.activeMethod.name,
      type: this.activeMethod.type,
      is_active: this.activeMethod.isActive ? 1 : 0,
      has_fees: formData.applyFees ? 1 : 0,
      fees_percentage: formData.feesPercentage || null,
      sort_order: this.activeMethod.apiData.sort_order,
      icon: this.activeMethod.apiData.icon,
      description: this.activeMethod.apiData.description,
      config: this.activeMethod.apiData.config,
    };

    this.paymentMethodsService.updatePaymentMethod(this.activeMethod.id, payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'نجح',
          detail: 'تم تحديث وسيلة الدفع بنجاح',
        });
        this.fetchPaymentMethods();
      },
      error: (error) => {
        console.error('Error updating payment method:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل في تحديث وسيلة الدفع',
        });
      },
    });
  }

  disableActiveMethod(): void {
    if (!this.activeMethod) {
      return;
    }

    this.paymentMethodsService.togglePaymentMethod(this.activeMethod.id).subscribe({
      next: () => {
        const statusText = this.activeMethod!.isActive ? 'تعطيل' : 'تفعيل';
        this.messageService.add({
          severity: 'success',
          summary: 'نجح',
          detail: `تم ${statusText} وسيلة الدفع بنجاح`,
        });
        this.fetchPaymentMethods();
      },
      error: (error) => {
        console.error('Error toggling payment method status:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل في تحديث حالة وسيلة الدفع',
        });
      },
    });
  }
  // ...

  openAddPaymentMethodDialog(): void {
    this.ref = this.dialogService.open(AddPaymentMethodDialog, {
      header: 'إضافة وسيلة دفع جديدة',
      width: '520px',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        paymentMethods: this.paymentMethods(),
      },
    });

    if (this.ref) {
      this.ref.onClose.subscribe((result) => {
        if (result?.success) {
          this.createPaymentMethod(result.data);
        }
      });
    }
  }

  private createPaymentMethod(formData: any): void {
    const payload = {
      name: formData.paymentMethodName,
      type: formData.paymentMethodType,
      is_active: 1,
      has_fees: formData.applyFees ? 1 : 0,
      fees_percentage: formData.applyFees ? formData.feesPercentage : null,
      sort_order: (this.paymentMethods().length || 0) + 1,
      icon: null,
      description: formData.description || '',
      config: formData.config,
    };

    this.paymentMethodsService.createPaymentMethod(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'نجح',
          detail: 'تم إضافة وسيلة الدفع بنجاح',
        });
        this.fetchPaymentMethods();
      },
      error: (error) => {
        console.error('Error creating payment method:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'خطأ',
          detail: 'فشل في إضافة وسيلة الدفع',
        });
      },
    });
  }

  deleteActiveMethod(): void {
    if (!this.activeMethod) {
      return;
    }

    this.confirmationService.confirm({
      message: `هل تأكد من حذف وسيلة الدفع "${this.activeMethod.name}"؟`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.paymentMethodsService.deletePaymentMethod(this.activeMethod!.id).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'نجح',
              detail: 'تم حذف وسيلة الدفع بنجاح',
            });
            this.fetchPaymentMethods();
          },
          error: (error) => {
            console.error('Error deleting payment method:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'خطأ',
              detail: 'فشل في حذف وسيلة الدفع',
            });
          },
        });
      },
    });
  }
}
