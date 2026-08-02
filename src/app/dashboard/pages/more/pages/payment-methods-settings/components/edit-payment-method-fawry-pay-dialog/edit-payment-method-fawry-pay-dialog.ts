import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SharedTextInputComponent } from '../../../../../../shared/components/shared-text-input/shared-text-input.component';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { PaymentMethodApiResponse } from '../../models/payment-methods-settings.model';

@Component({
  selector: 'app-edit-payment-method-fawry-pay-dialog',
  imports: [CommonModule, ReactiveFormsModule, SharedTextInputComponent, ToggleSwitchModule],
  templateUrl: './edit-payment-method-fawry-pay-dialog.html',
  styleUrl: './edit-payment-method-fawry-pay-dialog.scss',
})
export class EditPaymentMethodFawryPayDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  paymentMethodForm!: FormGroup;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
  ) {}

  ngOnInit() {
    this.paymentMethodForm = this.fb.group({
      accountName: ['', Validators.required],
      description: [''],
      applyFees: [false],
    });

    // Pre-fill with existing data if available
    if (this.config.data?.apiData) {
      const apiData: PaymentMethodApiResponse = this.config.data.apiData;

      this.paymentMethodForm.patchValue({
        accountName: apiData.name,
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
