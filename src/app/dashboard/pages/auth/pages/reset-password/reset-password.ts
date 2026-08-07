import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProgressBarModule } from 'primeng/progressbar';
import { SharedTextInputComponent } from '../../../../shared/components/shared-text-input/shared-text-input.component';

@Component({
  selector: 'app-reset-password',
  imports: [
    ProgressBarModule,
    SharedTextInputComponent,
    ReactiveFormsModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword {
  userForm!: FormGroup;

  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.userForm = this.fb.group({
      confirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      password: [
        '',
        [Validators.required, Validators.minLength(8)],
        { validators: this.passwordsMatchValidator },
      ],
    });
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
    console.log(this.userForm.value);
    // TODO: call auth service to create the account
  }
}
