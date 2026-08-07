import { Component, inject, signal } from '@angular/core';
import { SharedTextInputComponent } from '../../../../shared/components/shared-text-input/shared-text-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SharedSelectComponent } from '../../../../shared/components/shared-select/shared-select.component';
import { AuthService, LoginCredentials } from '../../services/auth.service';

@Component({
  selector: 'app-auth-login',
  imports: [
    SharedTextInputComponent,
    ReactiveFormsModule,
    ToggleSwitchModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './auth-login.html',
  styleUrl: './auth-login.scss',
})
export class AuthLogin {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  userForm!: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  ngOnInit() {
    this.userForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formValue = this.userForm.value;
    const credentials: LoginCredentials = {
      login: formValue.login,
      password: formValue.password,
      fcm_token: this.getOrGenerateFcmToken(),
      device_uuid: this.getOrGenerateDeviceUuid(),
      device_name: this.getDeviceName(),
      platform: this.getPlatform(),
      os_version: this.getOsVersion(),
      app_version: '1.0.0',
    };

    this.authService.login(credentials).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(error?.error?.message || 'Login failed. Please try again.');
      },
    });
  }

  private getOrGenerateFcmToken(): string {
    let token = localStorage.getItem('fcm_token');
    if (!token) {
      token =
        'd6JRL2eMRCC9BwbavyaOjk:APA91bHhcbJX5rFdOefSxP-k65LcJRhbuw8-JU5OpfLaqIb837PbYlUMoih7vs_UkAiZUXnwyZQvZSxGZ5bbrA9WwTG7yDolAZ8G3jUqGrMlKc0HTxmPnCg';
      localStorage.setItem('fcm_token', token);
    }
    return token;
  }

  private getOrGenerateDeviceUuid(): string {
    let uuid = localStorage.getItem('device_uuid');
    if (!uuid) {
      uuid = 'web_' + Math.random().toString(36).substr(2, 16);
      localStorage.setItem('device_uuid', uuid);
    }
    return uuid;
  }

  private getDeviceName(): string {
    return navigator.userAgent.substring(0, 100);
  }

  private getPlatform(): string {
    return /android/i.test(navigator.userAgent) ? 'android' : 'web';
  }

  private getOsVersion(): string {
    const match = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
    return match ? `${match[1]}.${match[2]}` : 'unknown';
  }
}
