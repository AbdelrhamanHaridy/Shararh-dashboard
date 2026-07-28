import { Component, OnInit } from '@angular/core';
import { SharedTextInputComponent } from '../../../../shared/components/shared-text-input/shared-text-input.component';
import { SharedSelectComponent } from '../../../../shared/components/shared-select/shared-select.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FrequentlyAskedQuestionsService } from '../../services/frequently-asked-questions.service';
import { FaqTargetType } from '../../models/frequently-asked-questions.model';
import { SharedChipListInput } from '../shared-chip-list-input/shared-chip-list-input';

export interface FaqTargetTypeOption {
  label: string;
  value: FaqTargetType;
}

// Real values expected by the API — keep in sync with the FAQ list page mapping
export const FAQ_TARGET_TYPES: FaqTargetTypeOption[] = [
  { label: 'الكل', value: 'all' },
  { label: 'عام', value: 'general' },
  { label: 'التاجر', value: 'owner' },
  { label: 'الكاشير', value: 'cashier' },
  { label: 'المندوب', value: 'collector' },
];

@Component({
  selector: 'app-add-faq-dialog',
  imports: [
    SharedTextInputComponent,
    SharedSelectComponent,
    SharedChipListInput,
    ReactiveFormsModule,
    CommonModule,
    ToggleSwitchModule,
  ],
  templateUrl: './add-faq-dialog.html',
  styleUrl: './add-faq-dialog.scss',
})
export class AddFaqDialog implements OnInit {
  addFaqForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  targetTypes = FAQ_TARGET_TYPES;

  constructor(
    private fb: FormBuilder,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private faqService: FrequentlyAskedQuestionsService,
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.addFaqForm = this.fb.group({
      question: ['', [Validators.required, Validators.minLength(5)]],
      answer: ['', [Validators.required, Validators.minLength(10)]],
      target_type: ['', Validators.required],
      tags: [[] as string[]],
      image_urls: [[] as string[]],
      youtube_links: [[] as string[]],
      attachments: [[] as string[]],
      is_active: [true],
    });
  }

  onTagsChange(values: string[]) {
    this.addFaqForm.patchValue({ tags: values });
  }

  onImageUrlsChange(values: string[]) {
    this.addFaqForm.patchValue({ image_urls: values });
  }

  onYoutubeLinksChange(values: string[]) {
    this.addFaqForm.patchValue({ youtube_links: values });
  }

  onSubmit() {
    if (this.addFaqForm.invalid) {
      this.addFaqForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.addFaqForm.value;
    const payload = {
      question: formValue.question,
      answer: formValue.answer,
      target_type: formValue.target_type,
      tags: formValue.tags || [],
      attachments: formValue.attachments || [],
      image_urls: formValue.image_urls || [],
      youtube_links: formValue.youtube_links || [],
      is_active: formValue.is_active ? 1 : 0,
    };

    this.faqService.createFaq(payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.ref.close(res.data);
      },
      error: (err) => {
        console.error('Error creating FAQ:', err);
        this.isSubmitting = false;
        this.errorMessage = 'حدث خطأ أثناء إضافة السؤال، حاول مرة أخرى';
      },
    });
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.addFaqForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getErrorMessage(fieldName: string): string {
    const field = this.addFaqForm.get(fieldName);
    if (!field) return '';
    if (field.hasError('required')) return 'هذا الحقل مطلوب';
    if (field.hasError('minlength')) {
      return `الحد الأدنى هو ${field.errors?.['minlength']?.requiredLength} أحرف`;
    }
    return '';
  }

  onCancel() {
    this.ref.close();
  }
}
