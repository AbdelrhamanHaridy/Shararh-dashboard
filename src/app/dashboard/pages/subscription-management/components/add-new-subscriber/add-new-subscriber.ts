import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SharedSelectComponent } from '../../../../shared/components/shared-select/shared-select.component';
import { SharedTextInputComponent } from '../../../../shared/components/shared-text-input/shared-text-input.component';
import { ToggleSwitchModule } from "primeng/toggleswitch";

@Component({
  selector: 'app-add-new-subscriber',
  imports: [CommonModule, ReactiveFormsModule, SharedSelectComponent, SharedTextInputComponent, ToggleSwitchModule],
  templateUrl: './add-new-subscriber.html',
  styleUrl: './add-new-subscriber.scss',
})
export class AddNewSubscriber implements OnInit {
  subscriberForm!: FormGroup;

  // Data options
  subscribers: any[] = [];
  packages: any[] = [];
  subscriptionDurations: any[] = [];
  paymentMethods: any[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
  ) {}

  ngOnInit() {
    // Initialize form
    this.subscriberForm = this.fb.group({
      subscriberName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      packageType: ['', Validators.required],
      subscriptionDuration: ['', Validators.required],
      paymentMethod: ['', Validators.required],
      paymentNotes: [''],
    });

    // Load options
    this.loadSubscribers();
    this.loadPackages();
    this.loadSubscriptionDurations();
    this.loadPaymentMethods();

    // You can access data passed from the parent component
    if (this.config.data) {
      console.log('Data received:', this.config.data);
      // Use the data as needed
    }
  }

  loadSubscribers() {
    // Example data - replace with your actual data
    this.subscribers = [
      { label: 'مشترك 1', value: 'subscriber1' },
      { label: 'مشترك 2', value: 'subscriber2' },
      { label: 'مشترك 3', value: 'subscriber3' },
    ];
  }

  loadPackages() {
    // Example data
    this.packages = [
      { label: 'باقة أساسية', value: 'basic' },
      { label: 'باقة متوسطة', value: 'medium' },
      { label: 'باقة متقدمة', value: 'premium' },
    ];
  }

  loadSubscriptionDurations() {
    // Example data
    this.subscriptionDurations = [
      { label: 'شهر واحد', value: '1' },
      { label: '3 أشهر', value: '3' },
      { label: '6 أشهر', value: '6' },
      { label: 'سنة واحدة', value: '12' },
    ];
  }

  loadPaymentMethods() {
    // Example data
    this.paymentMethods = [
      { label: 'بطاقة ائتمان', value: 'creditCard' },
      { label: 'التحويل البنكي', value: 'bankTransfer' },
      { label: 'محفظة رقمية', value: 'eWallet' },
      { label: 'نقداً', value: 'cash' },
    ];
  }

  // Method to close dialog with data
  closeDialog(data?: any) {
    this.ref.close(data);
  }

  // Method to save and close
  saveAndClose() {
    if (this.subscriberForm.valid) {
      const result = {
        success: true,
        data: this.subscriberForm.value,
      };
      this.closeDialog(result);
    }
  }
}
