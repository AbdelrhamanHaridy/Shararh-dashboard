// add-merchant-for-first-time.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { SharedTextInputComponent } from '../../../../shared/components/shared-text-input/shared-text-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SharedSelectComponent } from '../../../../shared/components/shared-select/shared-select.component';
import {
  LocationPickerMapComponent,
  LatLngValue,
} from '../../../../shared/components/location-picker-map/location-picker-map.component';
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
    LocationPickerMapComponent,
  ],
  templateUrl: './add-merchant-for-first-time.html',
  styleUrl: './add-merchant-for-first-time.scss',
})
export class AddMerchantForFirstTime extends BaseComponent implements OnInit {
  @ViewChild(LocationPickerMapComponent) locationMap!: LocationPickerMapComponent;

  userForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  governorateOptions = [
    { label: 'القاهرة', value: 'cairo' },
    { label: 'الإسكندرية', value: 'alexandria' },
    { label: 'الجيزة', value: 'giza' },
    { label: 'الدقهلية', value: 'dakahlia' },
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
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      businessName: ['', [Validators.required, Validators.minLength(3)]],
      storePhone: ['', [Validators.required, Validators.pattern(/^[0-9]{10,15}$/)]],
      governorate: ['', Validators.required],
      city: ['', Validators.required],
      streetName: ['', Validators.required],
      lat: [null],
      long: [null],
      employeeCount: ['', [Validators.required, Validators.min(1)]],
    });
  }

  // Called from the map's (locationChange) — updates the form so the
  // lat/long text inputs (kept read-only display fields, see template)
  // and the payload stay in sync with whatever the user picked on the map.
  onMapLocationChange(value: LatLngValue): void {
    this.userForm.patchValue({ lat: value.lat, long: value.long });
  }

  // "Use current location" now also recenters + drops the pin on the map,
  // instead of only patching the hidden form fields.
  useCurrentLocation() {
    if (!navigator.geolocation) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        this.userForm.patchValue({ lat: latitude, long: longitude });
        this.locationMap?.setExternalLocation(latitude, longitude);
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
        next: (response) => {
          this.isSubmitting = false;
          console.log('Owner created successfully:', response.data);
          this.router.navigate(['/user-database']);
        },
        error: (err) => {
          console.error('Error creating merchant:', err);
          this.isSubmitting = false;
          this.errorMessage = 'حدث خطأ أثناء إضافة التاجر، يرجى المحاولة مرة أخرى';
        },
      });
  }

  onCancel() {
    this.router.navigate(['/user-database']);
  }
}