import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

export type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

export interface ToastOptions {
  severity: ToastSeverity;
  summary: string;
  detail?: string;
  life?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private messageService = inject(MessageService);

  private readonly DEFAULT_LIFE_MS = 5000;
  private readonly DEFAULT_ERROR_LIFE_MS = 5000;

  /**
   * Show a success toast notification
   */
  success(summary: string, detail?: string, lifeMs?: number): void {
    this.show({
      severity: 'success',
      summary,
      detail,
      life: lifeMs ?? this.DEFAULT_LIFE_MS,
    });
  }

  /**
   * Show an error toast notification
   */
  error(summary: string, detail?: string, lifeMs?: number): void {
    this.show({
      severity: 'error',
      summary,
      detail,
      life: lifeMs ?? this.DEFAULT_ERROR_LIFE_MS,
    });
  }

  /**
   * Show an info toast notification
   */
  info(summary: string, detail?: string, lifeMs?: number): void {
    this.show({
      severity: 'info',
      summary,
      detail,
      life: lifeMs ?? this.DEFAULT_LIFE_MS,
    });
  }

  /**
   * Show a warning toast notification
   */
  warn(summary: string, detail?: string, lifeMs?: number): void {
    this.show({
      severity: 'warn',
      summary,
      detail,
      life: lifeMs ?? this.DEFAULT_LIFE_MS,
    });
  }

  /**
   * Show a toast notification with custom options
   */
  show(options: ToastOptions): void {
    this.messageService.add({
      severity: options.severity,
      summary: options.summary,
      detail: options.detail,
      life: options.life ?? this.DEFAULT_LIFE_MS,
    });
  }

  /**
   * Clear all active toast notifications
   */
  clear(): void {
    this.messageService.clear();
  }
}
