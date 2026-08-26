import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { SharedSelectComponent } from '../../../../shared/components/shared-select/shared-select.component';

@Component({
  selector: 'app-change-status-dialog',
  standalone: true,
  imports: [ReactiveFormsModule, SharedSelectComponent],
  templateUrl: './change-status-dialog.html',
})
export class ChangeStatusDialog implements OnInit {
  private fb = inject(FormBuilder);
  private ref = inject(DynamicDialogRef);
  private config = inject(DynamicDialogConfig);

  statusForm!: FormGroup;

  statusOptions = [
    { label: 'جديد', value: 'new' },
    { label: 'تم التواصل', value: 'contacted' },
    { label: 'مهتم', value: 'interested' },
    { label: 'مشترك', value: 'subscribed' },
    { label: 'مرفوض', value: 'rejected' },
  ];

  ngOnInit() {
    this.statusForm = this.fb.group({
      status: ['', Validators.required],
      note: [''],
    });

    // Pre-fill with current status if provided
    if (this.config.data?.currentStatus) {
      this.statusForm.patchValue({ status: this.config.data.currentStatus });
    }
  }

  onSubmit() {
    if (this.statusForm.valid) {
      const formValue = this.statusForm.value;
      this.ref.close({
        success: true,
        data: {
          status: formValue.status,
          note: formValue.note || undefined,
        },
      });
    }
  }

  onCancel() {
    this.ref.close({ success: false });
  }
}
