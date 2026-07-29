import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { takeUntil } from 'rxjs';
import { PricingAndPlansService } from '../../services/pricing-and-plans.service';
import { Plan, PlanPayload } from '../../models/pricing-and-plans.model';
import { SharedTextInputComponent } from '../../../../../../shared/components/shared-text-input/shared-text-input.component';
import { BaseComponent } from '../../../../../../shared/services/base.component';

@Component({
  selector: 'app-plan-dialog',
  imports: [CommonModule, ReactiveFormsModule, SharedTextInputComponent, ToggleSwitchModule],
  templateUrl: './plan-dialog.html',
  styleUrl: './plan-dialog.scss',
})
export class PlanDialog extends BaseComponent implements OnInit {
  planForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  planId: number | null = null;

  get isEditMode(): boolean {
    return this.planId !== null;
  }

  constructor(
    private fb: FormBuilder,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private plansService: PricingAndPlansService,
  ) {
    super();
  }

  ngOnInit() {
    const plan: Plan | undefined = this.config.data?.plan;
    this.initForm(plan);
    if (plan) {
      this.planId = plan.id;
    }
  }

  initForm(plan?: Plan) {
    this.planForm = this.fb.group({
      name: [plan?.name ?? '', Validators.required],

      is_unlimited_offices: [plan?.is_unlimited_offices ?? false],
      offices_limit: [plan?.offices_limit ?? null],

      is_unlimited_users: [plan?.is_unlimited_users ?? false],
      users_limit: [plan?.users_limit ?? null],

      is_unlimited_wallets: [plan?.is_unlimited_wallets ?? false],
      wallets_limit: [plan?.wallets_limit ?? null],

      is_unlimited_devices: [plan?.is_unlimited_devices ?? false],
      devices_limit: [plan?.devices_limit ?? null],

      monthly_price: [plan?.monthly_price ?? 0, [Validators.required, Validators.min(0)]],
      semi_annual_price: [plan?.semi_annual_price ?? 0, [Validators.required, Validators.min(0)]],
      yearly_price: [plan?.yearly_price ?? 0, [Validators.required, Validators.min(0)]],

      is_active: [plan?.is_active ?? true],
    });

    // Require a positive limit value only when the corresponding "unlimited" toggle is off
    this.wireLimitValidator('is_unlimited_offices', 'offices_limit');
    this.wireLimitValidator('is_unlimited_users', 'users_limit');
    this.wireLimitValidator('is_unlimited_wallets', 'wallets_limit');
    this.wireLimitValidator('is_unlimited_devices', 'devices_limit');
  }

  private wireLimitValidator(unlimitedKey: string, limitKey: string) {
    const unlimitedControl = this.planForm.get(unlimitedKey);
    const limitControl = this.planForm.get(limitKey);

    unlimitedControl?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe((isUnlimited) => {
      if (isUnlimited) {
        limitControl?.clearValidators();
        limitControl?.setValue(null);
        limitControl?.disable();
      } else {
        limitControl?.setValidators([Validators.required, Validators.min(0)]);
        limitControl?.enable();
      }
      limitControl?.updateValueAndValidity();
    });

    // Apply initial disabled state on load, without emitting (avoids clobbering initial value)
    if (unlimitedControl?.value) {
      limitControl?.disable({ emitEvent: false });
    }
  }

  private toBit(value: boolean): 0 | 1 {
    return value ? 1 : 0;
  }

  onSubmit() {
    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    // getRawValue() includes disabled controls (offices_limit etc. when unlimited)
    const formValue = this.planForm.getRawValue();

    const payload: PlanPayload = {
      name: formValue.name,
      offices_limit: formValue.is_unlimited_offices ? null : Number(formValue.offices_limit),
      users_limit: formValue.is_unlimited_users ? null : Number(formValue.users_limit),
      wallets_limit: formValue.is_unlimited_wallets ? null : Number(formValue.wallets_limit),
      devices_limit: formValue.is_unlimited_devices ? null : Number(formValue.devices_limit),
      is_unlimited_wallets: this.toBit(formValue.is_unlimited_wallets),
      is_unlimited_users: this.toBit(formValue.is_unlimited_users),
      is_unlimited_offices: this.toBit(formValue.is_unlimited_offices),
      is_unlimited_devices: this.toBit(formValue.is_unlimited_devices),
      monthly_price: Number(formValue.monthly_price),
      semi_annual_price: Number(formValue.semi_annual_price),
      yearly_price: Number(formValue.yearly_price),
      is_active: this.toBit(formValue.is_active),
    };

    const request$ = this.isEditMode
      ? this.plansService.updatePlan(this.planId!, payload)
      : this.plansService.createPlan(payload);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.ref.close(res.data);
      },
      error: (err) => {
        console.error('Error saving plan:', err);
        this.isSubmitting = false;
        this.errorMessage = 'حدث خطأ أثناء حفظ الباقة، حاول مرة أخرى';
      },
    });
  }

  onCancel() {
    this.ref.close();
  }
}
