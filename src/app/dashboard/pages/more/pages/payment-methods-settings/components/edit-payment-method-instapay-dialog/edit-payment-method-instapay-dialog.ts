import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SharedTextInputComponent } from '../../../../../../shared/components/shared-text-input/shared-text-input.component';
import { PaymentMethodApiResponse } from '../../models/payment-methods-settings.model';

@Component({
  selector: 'app-edit-payment-method-instapay-dialog',
  imports: [CommonModule, ReactiveFormsModule, SharedTextInputComponent, ToggleSwitchModule],
  templateUrl: './edit-payment-method-instapay-dialog.html',
  styleUrl: './edit-payment-method-instapay-dialog.scss',
})
export class EditPaymentMethodInstapayDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  paymentMethodForm!: FormGroup;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) {}

  ngOnInit() {
    this.paymentMethodForm = this.fb.group({
      bankName: ['', Validators.required],
      beneficiaryName: ['', Validators.required],
      accountNumber: ['', Validators.required],
      description: [''],
      applyFees: [false],
    });

    // Pre-fill with existing data if available
    if (this.config.data?.apiData) {
      const apiData: PaymentMethodApiResponse = this.config.data.apiData;
      const configMap: Record<string, string> = {};

      // Build config map from configs array
      if (apiData.configs) {
        apiData.configs.forEach((cfg) => {
          configMap[cfg.key] = cfg.value?.toString() || '';
        });
      }

      this.paymentMethodForm.patchValue({
        bankName: configMap['bank_name'] || '',
        beneficiaryName: configMap['account_holder_name'] || '',
        accountNumber: configMap['account_number'] || '',
        description: apiData.description || '',
        applyFees: apiData.has_fees,
      });
    }
  }

  closeDialog(data?: any) {
    this.ref.close(data);
  }

  saveAndClose() {
    if (this.paymentMethodForm.valid) {
      const result = {
        success: true,
        data: this.paymentMethodForm.value,
      };
      this.closeDialog(result);
    }
  }
}
