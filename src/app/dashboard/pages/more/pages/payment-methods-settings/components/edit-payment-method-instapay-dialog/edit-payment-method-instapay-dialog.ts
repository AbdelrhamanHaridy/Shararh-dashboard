import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SharedSelectComponent } from '../../../../../../shared/components/shared-select/shared-select.component';
import { SharedTextInputComponent } from '../../../../../../shared/components/shared-text-input/shared-text-input.component';

@Component({
  selector: 'app-edit-payment-method-instapay-dialog',
  imports: [CommonModule, ReactiveFormsModule, SharedSelectComponent, SharedTextInputComponent],
  templateUrl: './edit-payment-method-instapay-dialog.html',
  styleUrl: './edit-payment-method-instapay-dialog.scss',
})
export class EditPaymentMethodInstapayDialog implements OnInit {
  customerForm!: FormGroup;

  // Data options
  customers: any[] = [];
  governorates: any[] = [];
  customerSources: any[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    // Initialize form
    this.customerForm = this.fb.group({
      customerName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      governorate: ['', Validators.required],
      cityCenter: ['', Validators.required],
      streetName: ['', Validators.required],
      customerSource: ['', Validators.required],
      notes: [''],
    });

    // Load options
    this.loadCustomers();
    this.loadGovernorates();
    this.loadCustomerSources();

    // You can access data passed from the parent component
    if (this.config.data) {
      console.log('Data received:', this.config.data);
      // Use the data as needed
    }
  }

  loadCustomers() {
    // Example data - replace with your actual data
    this.customers = [
      { label: 'عميل 1', value: 'customer1' },
      { label: 'عميل 2', value: 'customer2' },
      { label: 'عميل 3', value: 'customer3' },
    ];
  }

  loadGovernorates() {
    // Example data
    this.governorates = [
      { label: 'القاهرة', value: 'cairo' },
      { label: 'الجيزة', value: 'giza' },
      { label: 'الإسكندرية', value: 'alexandria' },
    ];
  }

  loadCustomerSources() {
    // Example data
    this.customerSources = [
      { label: 'إعلان ممول', value: 'paidAds' },
      { label: 'وسائل التواصل', value: 'socialMedia' },
      { label: 'إحالة من عميل', value: 'referral' },
      { label: 'زيارة مباشرة', value: 'walkIn' },
    ];
  }

  // Method to close dialog with data
  closeDialog(data?: any) {
    this.ref.close(data);
  }

  // Method to save and close
  saveAndClose() {
    if (this.customerForm.valid) {
      const result = {
        success: true,
        data: this.customerForm.value,
      };
      this.closeDialog(result);
    }
  }
}
