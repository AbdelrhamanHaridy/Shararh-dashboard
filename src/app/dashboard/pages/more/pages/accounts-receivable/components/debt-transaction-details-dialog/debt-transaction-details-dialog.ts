import { Component, OnInit, signal, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../../../shared/services/base.component';
import { DebtTransactionsService } from '../../services/debt-transactions.service';
import { TransactionDetailsData } from '../../models/debt-transaction.model';

@Component({
  selector: 'app-debt-transaction-details-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './debt-transaction-details-dialog.html',
  styleUrl: './debt-transaction-details-dialog.scss',
})
export class DebtTransactionDetailsDialog extends BaseComponent implements OnInit {
  private debtTransactionsService = inject(DebtTransactionsService);
  private cdr = inject(ChangeDetectorRef);

  config = inject(DynamicDialogConfig);
  ref = inject(DynamicDialogRef);

  transactionDetails = signal<TransactionDetailsData | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  userId: number = 0;
  accountName: string = '';

  get title(): string {
    const employee = this.transactionDetails()?.employee;
    return employee ? `تفاصيل حساب ${employee.full_name}` : 'تفاصيل الحساب';
  }

  ngOnInit(): void {
    this.userId = this.config.data?.userId;
    this.accountName = this.config.data?.accountName;

    if (this.userId) {
      this.loadTransactionDetails();
    } else {
      this.error.set('معرف الحساب غير صحيح');
    }
  }

  private loadTransactionDetails(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.debtTransactionsService
      .getTransactionDetails(this.userId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.transactionDetails.set(response.data);
          }
          this.isLoading.set(false);
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to load transaction details:', err);
          this.error.set('فشل في تحميل تفاصيل العمليات');
          this.isLoading.set(false);
          this.cdr.markForCheck();
        },
      });
  }

  getTransactionTypeLabel(transaction: any): string {
    if (transaction.type === 'add') {
      return 'إضافة دين';
    } else if (transaction.type === 'payment') {
      return 'سداد';
    }
    return transaction.type_label || transaction.type;
  }

  getTransactionTypeColor(transaction: any): string {
    if (transaction.type === 'add') {
      return 'text-red-600';
    } else if (transaction.type === 'payment') {
      return 'text-green-600';
    }
    return 'text-gray-600';
  }

  onClose(): void {
    this.ref.close();
  }
}
