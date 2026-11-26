import { Component, computed, inject, signal } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UpdateCampaignType } from '../../models/version-stores.model';

export interface UpdateMessage {
  title: string;
  message: string;
}

// Default texts come from the API docs, the admin can edit them before sending
const DEFAULT_MESSAGES: Record<UpdateCampaignType, UpdateMessage> = {
  notification: {
    title: 'تحديث جديد متاح',
    message: 'يرجى التحديث لآخر إصدار متوفر لضمان استقرار التطبيق',
  },
  force: {
    title: 'تحديث إجباري مطلوب',
    message: 'هذا الإصدار أصبح غير مدعوم، يرجى التحديث للمتابعة',
  },
};

@Component({
  selector: 'app-customize-the-update-message-dialog',
  templateUrl: './customize-the-update-message-dialog.html',
})
export class CustomizeTheUpdateMessageDialog {
  private readonly ref = inject(DynamicDialogRef);
  private readonly config = inject(DynamicDialogConfig);

  readonly type: UpdateCampaignType = this.config.data?.type ?? 'notification';
  readonly isForce = this.type === 'force';
  readonly version: string = this.config.data?.version ?? '';

  readonly titleMaxLength = 100;
  readonly messageMaxLength = 200;

  title = signal(DEFAULT_MESSAGES[this.type].title);
  message = signal(DEFAULT_MESSAGES[this.type].message);

  canSubmit = computed(() => this.title().trim().length > 0 && this.message().trim().length > 0);

  submit(): void {
    if (!this.canSubmit()) return;
    this.ref.close({ title: this.title().trim(), message: this.message().trim() } as UpdateMessage);
  }

  cancel(): void {
    this.ref.close();
  }
}