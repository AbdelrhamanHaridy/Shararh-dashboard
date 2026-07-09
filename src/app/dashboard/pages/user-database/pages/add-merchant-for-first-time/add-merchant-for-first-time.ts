import { Component } from '@angular/core';
import { SharedTextInputComponent } from '../../../../shared/components/shared-text-input/shared-text-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SharedSelectComponent } from '../../../../shared/components/shared-select/shared-select.component';

@Component({
  selector: 'app-add-merchant-for-first-time',
  imports: [SharedTextInputComponent, ReactiveFormsModule, ToggleSwitchModule, CommonModule, SharedSelectComponent],
  templateUrl: './add-merchant-for-first-time.html',
  styleUrl: './add-merchant-for-first-time.scss',
})
export class AddMerchantForFirstTime {
  userForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      // Personal Information
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      businessName: ['', [Validators.required, Validators.minLength(3)]],

      // Location
      governorate: ['', Validators.required],
      city: ['', Validators.required],
      streetName: ['', Validators.required],

      // Business Details
      employeeCount: ['', [Validators.required, Validators.min(1)]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  // Add to your component
  governorateOptions = [
    { label: 'القاهرة', value: 'cairo' },
    { label: 'الإسكندرية', value: 'alexandria' },
    { label: 'الجيزة', value: 'giza' },
    { label: 'الدقهلية', value: 'dakahlia' },
    // ... add more governorates
  ];

  cityOptions = [
    { label: 'مدينة نصر', value: 'nasr_city' },
    { label: 'مصر الجديدة', value: 'heliopolis' },
    { label: 'العاصمة الإدارية', value: 'administrative_capital' },
    // ... add more cities
  ];
  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    }
  }
}
