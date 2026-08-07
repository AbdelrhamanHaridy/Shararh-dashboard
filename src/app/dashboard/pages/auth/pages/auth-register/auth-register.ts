import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SharedSelectComponent } from '../../../../shared/components/shared-select/shared-select.component';
import { SharedTextInputComponent } from '../../../../shared/components/shared-text-input/shared-text-input.component';
import { Router, RouterLink } from '@angular/router';
import { AuthService, RegisterData } from '../../services/auth.service';

interface CountryOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-auth-register',
  imports: [
    SharedTextInputComponent,
    SharedSelectComponent,
    ReactiveFormsModule,
    ToggleSwitchModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './auth-register.html',
  styleUrl: './auth-register.scss',
})
export class AuthRegister {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  userForm!: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  countryOptions: CountryOption[] = [
    { label: 'مصر', value: 'EG' },
    { label: 'السعودية', value: 'SA' },
    { label: 'الإمارات', value: 'AE' },
    { label: 'الكويت', value: 'KW' },
  ];

  governorateOptions: CountryOption[] = [
    { label: 'القاهرة', value: 'cairo' },
    { label: 'الإسكندرية', value: 'alexandria' },
    { label: 'الجيزة', value: 'giza' },
    { label: 'المنيا', value: 'minya' },
    { label: 'بني سويف', value: 'bani_suef' },
  ];

  roleOptions: CountryOption[] = [
    { label: 'صاحب متجر', value: 'store_owner' },
    { label: 'مدير', value: 'manager' },
    { label: 'موظف', value: 'employee' },
  ];

  ngOnInit() {
    this.userForm = this.fb.group(
      {
        first_name: ['', [Validators.required, Validators.minLength(2)]],
        last_name: ['', [Validators.required, Validators.minLength(2)]],
        email: ['', [Validators.required, Validators.email]],
        phone: ['', [Validators.required, Validators.pattern(/^01[0-9]{9}$/)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
        role: ['store_owner', [Validators.required]],
        store_name: ['', [Validators.required, Validators.minLength(2)]],
        governorate: ['cairo', [Validators.required]],
        city: ['', [Validators.required, Validators.minLength(2)]],
        address: ['', [Validators.required, Validators.minLength(5)]],
        store_phone: ['', [Validators.required]],
        lat: [30.0444, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
        long: [31.2357, [Validators.required, Validators.pattern(/^-?\d+(\.\d+)?$/)]],
        employees_count: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
        store_code: ['', [Validators.required, Validators.minLength(2)]],
        acceptTerms: [false, [Validators.requiredTrue]],
      },
      { validators: this.passwordsMatchValidator },
    );
  }

  private passwordsMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsMismatch: true };
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formValue = this.userForm.value;
    const registerData: RegisterData = {
      first_name: formValue.first_name,
      last_name: formValue.last_name,
      email: formValue.email,
      phone: formValue.phone,
      password: formValue.password,
      role: formValue.role,
      store_name: formValue.store_name,
      governorate: formValue.governorate,
      city: formValue.city,
      address: formValue.address,
      store_phone: formValue.store_phone,
      lat: parseFloat(formValue.lat),
      long: parseFloat(formValue.long),
      employees_count: formValue.employees_count,
      store_code: formValue.store_code,
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error?.error?.message || 'Registration failed. Please try again.');
      },
    });
  }
}
