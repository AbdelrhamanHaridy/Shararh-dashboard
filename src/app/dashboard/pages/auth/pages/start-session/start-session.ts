import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedTextInputComponent } from '../../../../shared/components/shared-text-input/shared-text-input.component';
import { AuthService, User } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-start-session',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SharedTextInputComponent],
  templateUrl: './start-session.html',
  styleUrl: './start-session.scss',
})
export class StartSession {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private sessionService = inject(SessionService);
  private router = inject(Router);

  currentUser = signal<User | null>(null);
  sessionForm!: FormGroup;
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.currentUser.set(user);
    }

    this.sessionForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  onSubmit(): void {
    if (this.sessionForm.invalid) {
      this.sessionForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const password = this.sessionForm.value.password;

    this.sessionService.startSession(password).subscribe({
      next: (response) => {
        this.isLoading.set(false);
        this.successMessage.set('Session started successfully!');
        // Optionally redirect after a short delay
        setTimeout(() => {
          this.router.navigate(['/employee-dashboard']);
        }, 1500);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error?.error?.message || 'Failed to start session. Please try again.',
        );
      },
    });
  }

  getInitials(): string {
    const user = this.currentUser();
    if (!user) return '';
    const firstName = user.first_name?.charAt(0) || '';
    const lastName = user.last_name?.charAt(0) || '';
    return (firstName + lastName).toUpperCase();
  }
}
