import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { takeUntil } from 'rxjs';
import { SharedTextInputComponent } from '../../../../shared/components/shared-text-input/shared-text-input.component';
import { SharedSelectComponent } from '../../../../shared/components/shared-select/shared-select.component';
import { BaseComponent } from '../../../../shared/services/base.component';
import { CustomerRequestsService } from '../../services/customer-requests.service';
import { CustomerRequest, CustomerRequestPayload } from '../../models/customer-request.model';

@Component({
  selector: 'app-edit-request-dialog',
  imports: [CommonModule, ReactiveFormsModule, SharedTextInputComponent, SharedSelectComponent],
  templateUrl: './edit-request-dialog.html',
  styleUrl: './edit-request-dialog.scss',
})
export class EditRequestDialog extends BaseComponent implements OnInit {
  requestForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  requestId!: number;

  statusOptions = [
    { label: 'قيد الانتظار', value: 'pending' },
    { label: 'قيد المراجعة', value: 'reviewing' },
    { label: 'تم الحل', value: 'resolved' },
    { label: 'ملغي', value: 'cancelled' },
  ];

  categoryOptions = [
    { label: 'المديونيات', value: 'debts' },
    { label: 'المحافظ', value: 'wallets' },
    { label: 'المعاملات', value: 'transactions' },
    { label: 'الورديات', value: 'shifts' },
    { label: 'التحويلات', value: 'transfers' },
    { label: 'إقفال اليوم', value: 'day_closing' },
    { label: 'أخرى', value: 'other' },
  ];

  sourceOptions = [
    { label: 'واتساب', value: 'whatsapp' },
    { label: 'هاتف', value: 'phone' },
    { label: 'فيسبوك', value: 'facebook' },
    { label: 'التطبيق', value: 'app' },
    { label: 'كاشير', value: 'cashier' },
    { label: 'محصل', value: 'collector' },
    { label: 'الإدارة', value: 'admin' },
    { label: 'أخرى', value: 'other' },
  ];

  departmentOptions = [
    { label: 'عام', value: 'general' },
    { label: 'المديونيات', value: 'debts' },
    { label: 'المحافظ', value: 'wallets' },
    { label: 'الكاشير', value: 'cashier' },
    { label: 'التحصيل', value: 'collector' },
    { label: 'الحسابات', value: 'accounting' },
    { label: 'الدعم الفني', value: 'support' },
    { label: 'أخرى', value: 'other' },
  ];

  constructor(
    private fb: FormBuilder,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private requestsService: CustomerRequestsService,
  ) {
    super();
  }

  ngOnInit() {
    // This dialog is edit-only — a request is always expected here
    const request: CustomerRequest | undefined = this.config.data?.request;

    if (!request) {
      this.errorMessage = 'تعذر تحميل بيانات الطلب';
      this.initForm();
      return;
    }

    this.requestId = request.id;
    this.initForm(request);
  }

  initForm(request?: CustomerRequest) {
    this.requestForm = this.fb.group({
      customer_name: [request?.customer_name ?? '', Validators.required],
      phone: [request?.phone ?? '', Validators.required],
      type: [request?.type ?? 'complaint', Validators.required],
      status: [request?.status ?? 'pending', Validators.required],
      category: [request?.category ?? '', Validators.required],
      source: [request?.source ?? '', Validators.required],
      department: [request?.department ?? '', Validators.required],
      branch_id: [request?.branch_id ?? null, Validators.required],
      assigned_user_id: [request?.assigned_user_id ?? null],
      details: [request?.details ?? '', Validators.required],
      admin_notes: [request?.admin_notes ?? ''],
    });
  }

  selectType(type: 'complaint' | 'suggestion') {
    this.requestForm.patchValue({ type });
  }

  onSubmit() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }
    if (!this.requestId) {
      this.errorMessage = 'تعذر تحديد الطلب المراد تعديله';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.requestForm.value;
    const payload: CustomerRequestPayload = {
      customer_name: formValue.customer_name,
      phone: formValue.phone,
      type: formValue.type,
      status: formValue.status,
      category: formValue.category,
      source: formValue.source,
      department: formValue.department,
      branch_id: Number(formValue.branch_id),
      assigned_user_id: formValue.assigned_user_id ? Number(formValue.assigned_user_id) : null,
      details: formValue.details,
      admin_notes: formValue.admin_notes || '',
    };

    this.requestsService
      .updateCustomerRequest(this.requestId, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.ref.close(res.data.customer_request);
        },
        error: (err) => {
          console.error('Error updating customer request:', err);
          this.isSubmitting = false;
          this.errorMessage = 'حدث خطأ أثناء حفظ التعديلات، حاول مرة أخرى';
        },
      });
  }

  onCancel() {
    this.ref.close();
  }
}