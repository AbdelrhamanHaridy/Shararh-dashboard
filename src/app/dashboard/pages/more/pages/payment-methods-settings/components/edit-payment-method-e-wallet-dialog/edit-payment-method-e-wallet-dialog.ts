import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SharedTextInputComponent } from '../../../../../../shared/components/shared-text-input/shared-text-input.component';

@Component({
  selector: 'app-edit-payment-method-e-wallet-dialog',
  imports: [CommonModule, ReactiveFormsModule, SharedTextInputComponent, ToggleSwitchModule],
  templateUrl: './edit-payment-method-e-wallet-dialog.html',
  styleUrl: './edit-payment-method-e-wallet-dialog.scss',
})
export class EditPaymentMethodEWalletDialog implements OnInit {
  paymentMethodForm!: FormGroup;

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
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

    // You can access data passed from the parent component
    if (this.config.data) {
      console.log('Data received:', this.config.data);
      // Use the data as needed
    }
  }

  // Method to close dialog with data
  closeDialog(data?: any) {
    this.ref.close(data);
  }

  // Method to save and close
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
