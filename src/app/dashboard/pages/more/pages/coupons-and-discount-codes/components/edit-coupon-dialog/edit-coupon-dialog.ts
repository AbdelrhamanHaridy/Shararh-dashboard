import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { DatePickerModule } from 'primeng/datepicker';
import { MultiSelectModule } from 'primeng/multiselect';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../../../shared/services/base.component';
import { SharedSelectComponent } from '../../../../../../shared/components/shared-select/shared-select.component';
import { SharedTextInputComponent } from '../../../../../../shared/components/shared-text-input/shared-text-input.component';
import { SelectOption, CouponPayload, CouponDetail } from '../../models/coupons-and-discount-codes.model';
import { CouponsAndDiscountCodesService } from '../../services/coupons-and-discount-codes.service';
import { UserDatabaseService } from '../../../../../user-database/services/user-database.service';

@Component({
  selector: 'app-edit-coupon-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedTextInputComponent,
    SharedSelectComponent,
    DatePickerModule,
    MultiSelectModule,
  ],
  templateUrl: './edit-coupon-dialog.html',
  styleUrl: './edit-coupon-dialog.scss',
})
export class EditCouponDialog extends BaseComponent implements OnInit {
  couponForm!: FormGroup;
  isSubmitting = false;
  isLoading = false;
  errorMessage = '';
  couponId!: number;

  discountTypes = [
    { label: 'نسبة مئوية (%)', value: 'percentage' },
    { label: 'مبلغ ثابت', value: 'fixed' },
  ];

  targetTypes = [
    { label: 'الكل', value: 'all_users' },
    { label: 'المشتركين النشطين', value: 'active_subscriptions' },
    { label: 'المشتركين المنتهية اشتراكاتهم', value: 'expired_subscriptions' },
    { label: 'العملاء الجدد', value: 'new_customers' },
    { label: 'خطط محددة', value: 'custom_plans' },
    { label: 'مستخدمين محددين', value: 'custom_users' },
  ];

  statusOptions = [
    { label: 'نشط', value: 'active' },
    { label: 'غير نشط', value: 'inactive' },
  ];

  planOptions: SelectOption[] = [];
  userOptions: SelectOption[] = [];
  isLoadingPlans = false;
  isLoadingUsers = false;

  constructor(
    private fb: FormBuilder,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private couponsService: CouponsAndDiscountCodesService,
    private userDatabaseService: UserDatabaseService,
  ) {
    super();
  }

  ngOnInit() {
    // Dialog expected to be opened with: data: { coupon: CouponDetail }
    const coupon: CouponDetail | undefined = this.config.data?.coupon;

    this.initForm();
    this.onGetPlans();
    this.onGetUsers();

    if (!coupon) {
      this.errorMessage = 'تعذر تحميل بيانات الكوبون';
      return;
    }

    this.couponId = coupon.id;
    this.patchFormFromCoupon(coupon);

    // Toggle plan_ids / user_ids validation based on target_type
    this.couponForm
      .get('target_type')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((type) => {
        const planIdsControl = this.couponForm.get('plan_ids');
        const userIdsControl = this.couponForm.get('user_ids');

        planIdsControl?.setValidators(
          type === 'custom_plans' ? [Validators.required, Validators.minLength(1)] : [],
        );
        userIdsControl?.setValidators(
          type === 'custom_users' ? [Validators.required, Validators.minLength(1)] : [],
        );

        planIdsControl?.updateValueAndValidity();
        userIdsControl?.updateValueAndValidity();
      });
  }

  initForm() {
    this.couponForm = this.fb.group(
      {
        code: ['', [Validators.required, Validators.minLength(3)]],
        title: ['', Validators.required],
        description: [''],
        discount_type: ['percentage', Validators.required],
        discount_value: [null, [Validators.required, Validators.min(0)]],
        max_discount_amount: [null],
        usage_limit: [null, [Validators.required, Validators.min(1)]],
        target_type: ['all_users', Validators.required],
        starts_at: [null, Validators.required],
        expires_at: [null, Validators.required],
        status: ['active', Validators.required],
        plan_ids: [[] as number[]],
        user_ids: [[] as number[]],
      },
      { validators: [this.dateRangeValidator] },
    );

    // discount_value can't exceed 100 when discount_type is percentage
    this.couponForm
      .get('discount_type')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((type) => {
        const discountValueControl = this.couponForm.get('discount_value');
        discountValueControl?.setValidators(
          type === 'percentage'
            ? [Validators.required, Validators.min(0), Validators.max(100)]
            : [Validators.required, Validators.min(0)],
        );
        discountValueControl?.updateValueAndValidity();
      });
  }

  // "2026-07-28 00:00:00" -> Date object (avoids inconsistent cross-browser
  // parsing of space-separated datetime strings via new Date(string))
  private parseApiDate(value: string | null): Date | null {
    if (!value) return null;
    const normalized = value.trim().replace(' ', 'T');
    const date = new Date(normalized);
    return isNaN(date.getTime()) ? null : date;
  }

  private patchFormFromCoupon(coupon: CouponDetail) {
    this.couponForm.patchValue({
      code: coupon.code,
      title: coupon.title,
      description: coupon.description,
      discount_type: coupon.discount_type,
      discount_value: coupon.discount_value,
      max_discount_amount: coupon.max_discount_amount,
      usage_limit: coupon.usage_limit,
      target_type: coupon.target_type,
      starts_at: this.parseApiDate(coupon.starts_at),
      expires_at: this.parseApiDate(coupon.expires_at),
      // API's coupon-level "status" can be a derived state like "expired";
      // only "active"/"inactive" are valid inputs here, so fall back safely
      status: coupon.status === 'active' || coupon.status === 'inactive' ? coupon.status : 'inactive',
      plan_ids: (coupon.applicable_plans || []).map((p) => p.id),
      user_ids: (coupon.target_users || []).map((u) => u.id),
    });
  }

  private dateRangeValidator(group: FormGroup) {
    const start = group.get('starts_at')?.value;
    const end = group.get('expires_at')?.value;
    if (start && end && new Date(end) <= new Date(start)) {
      return { dateRangeInvalid: true };
    }
    return null;
  }

  get isTargetSpecificPlans(): boolean {
    return this.couponForm.get('target_type')?.value === 'custom_plans';
  }

  get isTargetSpecificUsers(): boolean {
    return this.couponForm.get('target_type')?.value === 'custom_users';
  }

  onGetPlans() {
    this.isLoadingPlans = true;
    this.couponsService
      .getPlans()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const plans = res?.data ?? [];
          this.planOptions = plans.map((p: any) => ({ label: p.name, value: p.id }));
          this.isLoadingPlans = false;
        },
        error: (err) => {
          console.error('Error fetching plans:', err);
          this.isLoadingPlans = false;
        },
      });
  }

  onGetUsers() {
    this.isLoadingUsers = true;
    this.userDatabaseService
      .getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const users = res?.data ?? [];
          this.userOptions = users.map((u: any) => ({ label: u.full_name ?? u.name, value: u.id }));
          this.isLoadingUsers = false;
        },
        error: (err) => {
          console.error('Error fetching users:', err);
          this.isLoadingUsers = false;
        },
      });
  }

  private formatDate(value: Date | string | null): string {
    if (!value) return '';
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onSubmit() {
    if (this.couponForm.invalid) {
      this.couponForm.markAllAsTouched();
      return;
    }
    if (!this.couponId) {
      this.errorMessage = 'تعذر تحديد الكوبون المراد تعديله';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.couponForm.value;
    const payload: CouponPayload = {
      code: formValue.code,
      title: formValue.title,
      description: formValue.description || '',
      discount_type: formValue.discount_type,
      discount_value: Number(formValue.discount_value),
      max_discount_amount:
        formValue.max_discount_amount !== null && formValue.max_discount_amount !== ''
          ? Number(formValue.max_discount_amount)
          : null,
      usage_limit: Number(formValue.usage_limit),
      target_type: formValue.target_type,
      starts_at: this.formatDate(formValue.starts_at),
      expires_at: this.formatDate(formValue.expires_at),
      status: formValue.status,
      plan_ids: formValue.target_type === 'custom_plans' ? formValue.plan_ids || [] : [],
      user_ids: formValue.target_type === 'custom_users' ? formValue.user_ids || [] : [],
    };

    this.couponsService
      .updateCoupon(this.couponId, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.ref.close(res.data);
        },
        error: (err) => {
          console.error('Error updating coupon:', err);
          this.isSubmitting = false;
          this.errorMessage = 'حدث خطأ أثناء حفظ التعديلات، حاول مرة أخرى';
        },
      });
  }

  onCancel() {
    this.ref.close();
  }
}