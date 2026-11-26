import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { finalize } from 'rxjs';
import { SharedSelectComponent } from '../../../../shared/components/shared-select/shared-select.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { PotentialCustomerCenterService } from '../../services/potential-customer-center.service';

interface EmployeeOption {
  label: string;
  value: number;
}

@Component({
  selector: 'app-assign-employee-dialog',
  imports: [ReactiveFormsModule, SharedSelectComponent],
  templateUrl: './assign-employee-dialog.html',
  styleUrl: './assign-employee-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AssignEmployeeDialog implements OnInit {
  private readonly potentialCustomerService = inject(PotentialCustomerCenterService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly toastService = inject(ToastService);
  private readonly config = inject(DynamicDialogConfig);
  readonly ref = inject(DynamicDialogRef);

  readonly assignmentForm = new FormGroup({
    employeeId: new FormControl<number | null>(null, Validators.required),
  });
  readonly employees = signal<EmployeeOption[]>([]);
  readonly isLoadingEmployees = signal(true);
  readonly isSubmitting = signal(false);
  readonly employeeLoadError = signal('');

  private leadId: number | null = null;

  ngOnInit(): void {
    const leadId: unknown = this.config.data?.leadId;
    if (typeof leadId !== 'number' || !Number.isInteger(leadId) || leadId <= 0) {
      console.error('AssignEmployeeDialog opened without a valid lead ID');
      this.toastService.error('تعذر تعيين المسؤول', 'بيانات العميل غير صالحة');
      this.ref.close();
      return;
    }

    this.leadId = leadId;
    this.potentialCustomerService
      .getLeadEmployees()
      .pipe(finalize(() => this.isLoadingEmployees.set(false)))
      .subscribe({
        next: (response) => {
          this.employees.set(
            response.data.employees.map((employee) => ({
              label: employee.name,
              value: employee.id,
            })),
          );
          this.cdr.markForCheck();
        },
        error: (error: unknown) => {
          console.error('Failed loading employees for lead assignment:', error);
          this.employeeLoadError.set('تعذر تحميل قائمة الموظفين');
          this.toastService.error('فشل تحميل الموظفين', this.getErrorMessage(error));
          this.cdr.markForCheck();
        },
      });
  }

  assignEmployee(): void {
    const employeeId = this.assignmentForm.controls.employeeId.value;
    if (
      this.assignmentForm.invalid ||
      employeeId === null ||
      this.leadId === null ||
      this.isSubmitting()
    ) {
      this.assignmentForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.potentialCustomerService
      .assignLead(this.leadId, employeeId)
      .pipe(finalize(() => this.isSubmitting.set(false)))
      .subscribe({
        next: () => {
          this.toastService.success('تم التعيين', 'تم تعيين المسؤول بنجاح');
          this.ref.close({ success: true });
        },
        error: (error: unknown) => {
          console.error('Failed assigning lead to employee:', error);
          this.toastService.error('فشل تعيين المسؤول', this.getErrorMessage(error));
          this.cdr.markForCheck();
        },
      });
  }

  private getErrorMessage(error: unknown): string {
    const errorResponse =
      this.isRecord(error) && this.isRecord(error['error'])
        ? error['error']
        : this.isRecord(error)
          ? error
          : {};
    const fieldErrors = errorResponse['errors'];

    if (this.isRecord(fieldErrors)) {
      const messages = Object.values(fieldErrors).flatMap((value) =>
        Array.isArray(value)
          ? value.filter((message): message is string => typeof message === 'string')
          : typeof value === 'string'
            ? [value]
            : [],
      );

      if (messages.length > 0) return messages.join(' ');
    }

    return typeof errorResponse['message'] === 'string'
      ? errorResponse['message']
      : 'حدث خطأ، يرجى المحاولة مرة أخرى';
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }
}
