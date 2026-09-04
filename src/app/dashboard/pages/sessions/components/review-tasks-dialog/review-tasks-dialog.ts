// review-tasks-dialog.ts
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CheckboxModule } from 'primeng/checkbox';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SessionsService } from '../../services/sessions.service';

interface TaskItem {
  id: number;
  label: string;
  is_completed: boolean;
}

@Component({
  selector: 'app-review-tasks-dialog',
  imports: [FormsModule, CheckboxModule],
  templateUrl: './review-tasks-dialog.html',
  styleUrl: './review-tasks-dialog.scss',
})
export class ReviewTasksDialog {
  private readonly config = inject(DynamicDialogConfig);
  private readonly ref = inject(DynamicDialogRef);
  private readonly sessionsService = inject(SessionsService);

  tasks: TaskItem[] = this.config.data?.tasks ?? [];
  isSubmitting = false;
  errorMessage: string | null = null;

  selectedTaskIds = new Set<number>();

  toggleSelection(taskId: number): void {
    if (this.selectedTaskIds.has(taskId)) {
      this.selectedTaskIds.delete(taskId);
      return;
    }
    this.selectedTaskIds.add(taskId);
  }

  isSelected(taskId: number): boolean {
    return this.selectedTaskIds.has(taskId);
  }

  onConfirm(): void {
    const sessionId = this.config.data?.sessionId;
    if (!sessionId || this.selectedTaskIds.size === 0 || this.isSubmitting) return;

    this.isSubmitting = true;
    this.errorMessage = null;

    this.sessionsService
      .reviewSession(sessionId, { task_ids: [...this.selectedTaskIds] })
      .subscribe({
        next: (response) => this.ref.close(response.data),
        error: (error) => {
          this.isSubmitting = false;
          this.errorMessage = error?.error?.message || 'حدث خطأ أثناء مراجعة المهام';
        },
      });
  }
}
