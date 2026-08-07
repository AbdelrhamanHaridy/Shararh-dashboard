import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SharedTextInputComponent } from '../../../../../../shared/components/shared-text-input/shared-text-input.component';
import { PaymentMethodApiResponse } from '../../models/payment-methods-settings.model';

@Component({
  selector: 'app-edit-payment-method-e-wallet-dialog',
  imports: [CommonModule, ReactiveFormsModule, SharedTextInputComponent, ToggleSwitchModule],
  templateUrl: './edit-payment-method-e-wallet-dialog.html',
  styleUrl: './edit-payment-method-e-wallet-dialog.scss',
})
export class EditPaymentMethodEWalletDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  paymentMethodForm!: FormGroup;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) {}

  ngOnInit() {
    this.paymentMethodForm = this.fb.group({
      paymentMethodName: ['', Validators.required],
      walletNumber: ['', Validators.required],
      accountName: ['', Validators.required],
      description: [''],
      applyFees: [false],
      feesPercentage: ['', Validators.required],
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
        paymentMethodName: apiData.name,
        walletNumber: configMap['wallet_number'] || '',
        accountName: configMap['account_holder_name'] || '',
        description: apiData.description || '',
        applyFees: apiData.has_fees,
        feesPercentage: apiData.fees_percentage || '',
      });

      // Update validators based on applyFees
      if (apiData.has_fees) {
        this.paymentMethodForm.get('feesPercentage')?.setValidators(Validators.required);
      } else {
        this.paymentMethodForm.get('feesPercentage')?.clearValidators();
      }
      this.paymentMethodForm.get('feesPercentage')?.updateValueAndValidity();
    }

    // Handle fees toggle
    this.paymentMethodForm.get('applyFees')?.valueChanges.subscribe((applyFees: boolean) => {
      const feesControl = this.paymentMethodForm.get('feesPercentage');
      if (applyFees) {
        feesControl?.setValidators(Validators.required);
      } else {
        feesControl?.clearValidators();
      }
      feesControl?.updateValueAndValidity();
    });
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
