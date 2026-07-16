import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, Validators, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SharedSelectComponent } from '../../shared/components/shared-select/shared-select.component';
import { SharedTextInputComponent } from '../../shared/components/shared-text-input/shared-text-input.component';
interface CountryOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-auth',
  imports: [
    PageHeaderComponent,
    SharedTextInputComponent,
    SharedSelectComponent,
    ReactiveFormsModule,
    ToggleSwitchModule,
    CommonModule,
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.scss',
})
export class Auth {
  userForm!: FormGroup;
  countryOptions: CountryOption[] = [
    { label: 'مصر', value: 'EG' },
    { label: 'السعودية', value: 'SA' },
    { label: 'الإمارات', value: 'AE' },
    { label: 'الكويت', value: 'KW' },
  ];
  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.userForm = this.fb.group(
      {
        fullName: ['', [Validators.required, Validators.minLength(3)]],
        username: ['', [Validators.required, Validators.minLength(3)]],
        country: ['EG', [Validators.required]],
        phone: ['', [Validators.required, Validators.pattern(/^01[0-9]{9}$/)]],
        email: ['', [Validators.required, Validators.email]],
        confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        accountType: ['business', [Validators.required]],
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

  selectAccountType(type: 'business' | 'personal'): void {
    this.userForm.get('accountType')?.setValue(type);
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    console.log(this.userForm.value);
    // TODO: call auth service to create the account
  }
}
