import { Component, OnInit } from '@angular/core';
import { SharedTextInputComponent } from '../../../../shared/components/shared-text-input/shared-text-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SharedSelectComponent } from '../../../../shared/components/shared-select/shared-select.component';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';
import { AddMerchantPayload } from '../../models/add-merchant.model';
import { BaseComponent } from '../../../../shared/services/base.component';
import { OwnerService } from '../../services/owner.service.service';

@Component({
  selector: 'app-add-merchant-for-first-time',
  imports: [
    SharedTextInputComponent,
    ReactiveFormsModule,
    ToggleSwitchModule,
    CommonModule,
    SharedSelectComponent,
  ],
  templateUrl: './add-merchant-for-first-time.html',
  styleUrl: './add-merchant-for-first-time.scss',
})
export class AddMerchantForFirstTime extends BaseComponent implements OnInit {
  userForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  governorateOptions = [
    { label: 'القاهرة', value: 'cairo' },
    { label: 'الإسكندرية', value: 'alexandria' },
    { label: 'الجيزة', value: 'giza' },
    { label: 'الدقهلية', value: 'dakahlia' },
    // ... add more governorates
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private ownerService: OwnerService,
  ) {
    super();
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      // Personal Information
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],

      // Store Information
      businessName: ['', [Validators.required, Validators.minLength(3)]],
      storePhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],

      // Location
      governorate: ['', Validators.required],
      city: ['', Validators.required],
      streetName: ['', Validators.required],

      // Optional geo-coordinates
      lat: [null],
      long: [null],

      // Business Details
      employeeCount: ['', [Validators.required, Validators.min(1)]],
    });
  }

  // Populate lat/long from the browser's geolocation, if the user allows it
  useCurrentLocation() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.userForm.patchValue({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
      },
      (err) => {
        console.error('Error getting location:', err);
      },
    );
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.userForm.value;
    const payload: AddMerchantPayload = {
      first_name: formValue.firstName,
      last_name: formValue.lastName,
      email: formValue.email,
      phone: formValue.phoneNumber,
      password: formValue.password,
      store_name: formValue.businessName,
      governorate: formValue.governorate,
      city: formValue.city,
      address: formValue.streetName,
      store_phone: formValue.storePhone,
      lat: formValue.lat !== null && formValue.lat !== '' ? Number(formValue.lat) : null,
      long: formValue.long !== null && formValue.long !== '' ? Number(formValue.long) : null,
      employees_count: Number(formValue.employeeCount),
    };

    this.ownerService
      .createOwner(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/merchants']); // adjust to your actual listing route
        },
        error: (err) => {
          console.error('Error creating merchant:', err);
          this.isSubmitting = false;
          this.errorMessage = 'حدث خطأ أثناء إضافة التاجر، يرجى المحاولة مرة أخرى';
        },
      });
  }

  onCancel() {
    this.router.navigate(['/merchants']); // adjust to your actual listing route
  }
}
