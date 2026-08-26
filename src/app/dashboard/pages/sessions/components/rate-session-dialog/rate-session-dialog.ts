import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SessionsService } from '../../services/sessions.service';

@Component({
  selector: 'app-rate-session-dialog',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './rate-session-dialog.html',
})
export class RateSessionDialog {
  private readonly fb = inject(FormBuilder);
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);
  private readonly sessionsService = inject(SessionsService);

  isSubmitting = false;
  errorMessage: string | null = null;

  ratingOptions = [
    { label: 'ممتازة', value: 'excellent' },
    { label: 'جيدة', value: 'good' },
    { label: 'مقبولة', value: 'acceptable' },
    { label: 'ضعيفة', value: 'poor' },
  ];

  form = this.fb.group({
    rating: ['', Validators.required],
    review_notes: [''],
  });

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const sessionId = this.config.data?.sessionId;
    if (!sessionId) return;

    this.isSubmitting = true;
    this.errorMessage = null;

    this.sessionsService
      .reviewSession(sessionId, {
        rating: this.form.value.rating as any,
        review_notes: this.form.value.review_notes || undefined,
      })
      .subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.ref.close(res.data);
        },
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error?.error?.message || 'حدث خطأ أثناء حفظ التقييم';
        },
      });
  }

  onCancel(): void {
    this.ref.close();
  }
}