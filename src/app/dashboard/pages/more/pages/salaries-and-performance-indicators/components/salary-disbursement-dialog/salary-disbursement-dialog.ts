import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
interface PaymentMethod {
  id: string;
  label: string;
}
@Component({
  selector: 'app-salary-disbursement-dialog',
  imports: [CommonModule],
  templateUrl: './salary-disbursement-dialog.html',
  styleUrl: './salary-disbursement-dialog.scss',
})
export class SalaryDisbursementDialog {
  employee = {
    name: 'محمد عبدالله العتيبي',
    role: 'خدمة عملاء',
    avatarUrl: 'assets/images/avatars/employee.jpg',
    isVerified: true,
  };

  currency = 'EGP';
  netSalary = '14,500.00';
  totalCost = '14,500.00';

  paymentMethods: PaymentMethod[] = [
    { id: 'cash', label: 'نقدي' },
    { id: 'ewallet', label: 'محفظه الكترونيه' },
    { id: 'bank', label: 'تحويل بنكي' },
  ];

  selectedMethodId = 'cash';

  selectPaymentMethod(id: string): void {
    this.selectedMethodId = id;
  }

  onClose(): void {
    // TODO: close dialog
  }

  onDisburseSalary(): void {
    console.log('Disbursing salary via', this.selectedMethodId);
    // TODO: call API to process the salary disbursement
  }
}
