import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { PaymentMethod } from '../../models/payment-methods-settings.model';

interface ConfigFieldDef {
  key: string;
  label: string;
  placeholder?: string;
}

interface PaymentTypeOption {
  label: string;
  value: string;
}

const PAYMENT_TYPE_OPTIONS: PaymentTypeOption[] = [
  { label: 'Fawry', value: 'fawry' },
  { label: 'Wallet', value: 'wallet' },
  { label: 'Instapay', value: 'instapay' },
  { label: 'Bank Transfer', value: 'bank_transfer' },
  { label: 'Card', value: 'card' },
];

@Component({
  selector: 'app-add-payment-method-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    CheckboxModule,
    SelectModule,
    ButtonModule,
  ],
  templateUrl: './add-payment-method-dialog.html',
  styleUrl: './add-payment-method-dialog.scss',
})
export class AddPaymentMethodDialog implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  typeOptions = PAYMENT_TYPE_OPTIONS;
  configFields: ConfigFieldDef[] = [];
  isSubmitting = false;
  paymentMethods: PaymentMethod[] = [];

  form: FormGroup = this.fb.group({
    paymentMethodType: ['fawry', Validators.required],
    paymentMethodName: ['', Validators.required],
    description: [''],
    applyFees: [false],
    feesPercentage: [{ value: null, disabled: true }],
    config: this.fb.group({}),
  });

  ngOnInit(): void {
    // Get payment methods from dialog config for template configs
    if (this.config.data?.paymentMethods) {
      this.paymentMethods = this.config.data.paymentMethods;
    }

    this.buildConfigGroup(this.form.get('paymentMethodType')?.value);

    this.form.get('paymentMethodType')?.valueChanges.subscribe((type: string) => {
      this.buildConfigGroup(type);
    });

    this.form.get('applyFees')?.valueChanges.subscribe((applyFees: boolean) => {
      const feesControl = this.form.get('feesPercentage');
      if (applyFees) {
        feesControl?.enable();
        feesControl?.setValidators([Validators.required, Validators.min(0), Validators.max(100)]);
      } else {
        feesControl?.disable();
        feesControl?.clearValidators();
        feesControl?.setValue(null);
      }
      feesControl?.updateValueAndValidity();
    });
  }

  private buildConfigGroup(type: string): void {
    // Get template config from existing payment methods of the same type
    const templateMethod = this.paymentMethods.find((m) => m.type === type);
    const configFields: ConfigFieldDef[] = [];

    if (templateMethod?.apiData?.configs) {
      templateMethod.apiData.configs.forEach((config) => {
        configFields.push({
          key: config.key,
          label: config.label,
          placeholder: config.value?.toString() || '',
        });
      });
    }

    this.configFields = configFields;

    const group = this.fb.group({});
    for (const field of configFields) {
      group.addControl(field.key, this.fb.control(field.placeholder || ''));
    }
    this.form.setControl('config', group);
  }

  onCancel(): void {
    this.ref.close();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.getRawValue();

    const config: Record<string, string> = {};
    for (const field of this.configFields) {
      config[field.key] = raw.config[field.key] ?? '';
    }

    this.ref.close({
      success: true,
      data: {
        paymentMethodType: raw.paymentMethodType,
        paymentMethodName: raw.paymentMethodName,
        description: raw.description,
        applyFees: raw.applyFees,
        feesPercentage: raw.applyFees ? raw.feesPercentage : null,
        config,
      },
    });
  }
}
