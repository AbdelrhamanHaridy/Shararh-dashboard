import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../../../shared/services/base.component';
import { DebtTransactionsService } from '../../services/debt-transactions.service';
import { DebtTransactionPayload } from '../../models/debt-transaction.model';

export type DebtTransactionMode = 'add' | 'payment';

@Component({
  selector: 'app-debt-transaction-dialog',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './debt-transaction-dialog.html',
  styleUrl: './debt-transaction-dialog.scss',
})
export class DebtTransactionDialog extends BaseComponent implements OnInit {
  form!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  mode: DebtTransactionMode = 'add';
  accountName = '';
  userId!: number;

  get title(): string {
    return `حساب ${this.accountName}`;
  }

  get submitLabel(): string {
    if (this.isSubmitting) return 'جاري الحفظ...';
    return this.mode === 'add' ? 'اضافه' : 'سداد';
  }

  constructor(
    private fb: FormBuilder,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private debtTransactionsService: DebtTransactionsService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.mode = this.config.data?.mode ?? 'add';
    this.accountName = this.config.data?.accountName ?? '';
    this.userId = this.config.data?.userId;

    if (!this.userId) {
      this.errorMessage = 'تعذر تحديد الحساب المطلوب';
      this.cdr.markForCheck();
    }

    this.form = this.fb.group({
      amount: [0, [Validators.required, Validators.min(1)]],
      description: [''],
    });
  }

  onSubmit() {
    if (this.form.invalid || !this.userId) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const payload: DebtTransactionPayload = {
      user_id: this.userId,
      amount: Number(this.form.value.amount),
      description: this.form.value.description || '',
    };

    const request$ =
      this.mode === 'add'
        ? this.debtTransactionsService.addTransaction(payload)
        : this.debtTransactionsService.payTransaction(payload);

    request$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.cdr.markForCheck();
        this.ref.close(res.data);
      },
      error: (err) => {
        console.error('Error submitting debt transaction:', err);
        this.isSubmitting = false;
        this.errorMessage = 'حدث خطأ أثناء تنفيذ العملية، حاول مرة أخرى';
        this.cdr.markForCheck();
      },
    });
  }

  onClose() {
    this.ref.close();
  }
}
