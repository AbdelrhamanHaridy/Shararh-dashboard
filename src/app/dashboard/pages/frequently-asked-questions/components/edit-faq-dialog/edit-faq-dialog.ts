import { Component, OnInit } from '@angular/core';
import { SharedTextInputComponent } from '../../../../shared/components/shared-text-input/shared-text-input.component';
import { SharedSelectComponent } from '../../../../shared/components/shared-select/shared-select.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CommonModule } from '@angular/common';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { FrequentlyAskedQuestionsService } from '../../services/frequently-asked-questions.service';
import { Faq } from '../../models/frequently-asked-questions.model';
import { FAQ_TARGET_TYPES } from '../add-faq-dialog/add-faq-dialog';
import { SharedChipListInput } from '../shared-chip-list-input/shared-chip-list-input';

@Component({
  selector: 'app-edit-faq-dialog',
  imports: [
    SharedTextInputComponent,
    SharedSelectComponent,
    SharedChipListInput,
    ReactiveFormsModule,
    CommonModule,
    ToggleSwitchModule,
  ],
  templateUrl: './edit-faq-dialog.html',
  styleUrl: './edit-faq-dialog.scss',
})
export class EditFaqDialog implements OnInit {
  editFaqForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';
  faqId!: number;

  targetTypes = FAQ_TARGET_TYPES;

  constructor(
    private fb: FormBuilder,
    public config: DynamicDialogConfig,
    public ref: DynamicDialogRef,
    private faqService: FrequentlyAskedQuestionsService,
  ) {}

  ngOnInit() {
    // Dialog is expected to be opened with: config.data = { faq: Faq }
    const faq: Faq | undefined = this.config.data?.faq;

    if (!faq) {
      this.errorMessage = 'تعذر تحميل بيانات السؤال';
      this.initForm();
      return;
    }

    this.faqId = faq.id;
    this.initForm(faq);
  }

  initForm(faq?: Faq) {
    this.editFaqForm = this.fb.group({
      question: [faq?.question ?? '', [Validators.required, Validators.minLength(5)]],
      answer: [faq?.answer ?? '', [Validators.required, Validators.minLength(10)]],
      target_type: [faq?.target_type ?? '', Validators.required],
      tags: [faq?.tags ?? []],
      image_urls: [faq?.image_urls ?? []],
      youtube_links: [faq?.youtube_links ?? []],
      attachments: [faq?.attachments ?? []],
      is_active: [faq?.is_active ?? true],
    });
  }

  onTagsChange(values: string[]) {
    this.editFaqForm.patchValue({ tags: values });
  }

  onImageUrlsChange(values: string[]) {
    this.editFaqForm.patchValue({ image_urls: values });
  }

  onYoutubeLinksChange(values: string[]) {
    this.editFaqForm.patchValue({ youtube_links: values });
  }

  onSubmit() {
    if (this.editFaqForm.invalid) {
      this.editFaqForm.markAllAsTouched();
      return;
    }
    if (!this.faqId) {
      this.errorMessage = 'تعذر تحديد السؤال المراد تعديله';
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.editFaqForm.value;
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

    this.faqService.updateFaq(this.faqId, payload).subscribe({
      next: (res) => {
        this.isSubmitting = false;
        this.ref.close(res.data);
      },
      error: (err) => {
        console.error('Error updating FAQ:', err);
        this.isSubmitting = false;
        this.errorMessage = 'حدث خطأ أثناء حفظ التعديلات، حاول مرة أخرى';
      },
    });
  }

  onCancel() {
    this.ref.close();
  }
}
