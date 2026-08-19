import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { SharedSelectComponent } from '../../../../shared/components/shared-select/shared-select.component';
import { SharedTextInputComponent } from '../../../../shared/components/shared-text-input/shared-text-input.component';
import { PotentialCustomerCenterService } from '../../services/potential-customer-center.service';
import { UserDatabaseService } from '../../../user-database/services/user-database.service';
import { finalize } from 'rxjs';
import { Lead } from '../../models/potential-customer-center.model';

@Component({
  selector: 'app-edit-potential-customer-dialog',
  imports: [CommonModule, ReactiveFormsModule, SharedSelectComponent, SharedTextInputComponent],
  templateUrl: './edit-potential-customer-dialog.html',
  styleUrl: './edit-potential-customer-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPotentialCustomerDialog implements OnInit {
  private fb = inject(FormBuilder);
  private potentialCustomerService = inject(PotentialCustomerCenterService);
  private userService = inject(UserDatabaseService);
  private cdr = inject(ChangeDetectorRef);
  public ref = inject(DynamicDialogRef);
  public config = inject(DynamicDialogConfig);

  customerForm!: FormGroup;
  isLoading = signal(false);

  // Data options
  employees = signal<any[]>([]);
  governorates = signal<any[]>([]);
  customerSources = signal<any[]>([]);

  // The lead being edited, passed in via dialog data
  private leadId!: number;

  ngOnInit() {
    const lead: Lead | undefined = this.config.data?.lead;

    if (!lead) {
      // Nothing to edit against — close immediately rather than show a broken form.
      console.error('EditPotentialCustomerDialog opened without a lead in dialog data');
      this.ref.close();
      return;
    }

    this.leadId = lead.id;

    // group_ids isn't returned by the leads list API today, so we can't
    // reliably prefill it — default to [[]] same as the create dialog.
    this.customerForm = this.fb.group({
      name: [lead.name, Validators.required],
      activity_name: [lead.activity_name, Validators.required],
      phone: [lead.phone, Validators.required],
      governorate: [lead.governorate, Validators.required],
      city: [lead.city, Validators.required],
      street_name: [lead.street_name, Validators.required],
      source: [lead.source, Validators.required],
      assigned_employee_id: [lead.assigned_employee?.id ?? ''],
      notes: [lead.notes ?? ''],
      group_ids: [[[]]],
    });

    this.loadEmployees();
    this.loadGovernorates();
    this.loadCustomerSources();
  }

  loadEmployees() {
    this.userService.getUsers().subscribe({
      next: (response) => {
        const users = response?.data ?? response ?? [];
        const mapped = Array.isArray(users)
          ? users.map((user: any) => ({
              label: user.full_name ?? user.name ?? user.first_name ?? user.username ?? '—',
              value: user.id,
            }))
          : [];
        this.employees.set(mapped);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading employees:', error);
        this.employees.set([]);
        this.cdr.markForCheck();
      },
    });
  }

  loadGovernorates() {
    this.governorates.set([
      { label: 'القاهرة', value: 'cairo' },
      { label: 'الجيزة', value: 'giza' },
      { label: 'الإسكندرية', value: 'alexandria' },
      { label: 'الدقهلية', value: 'dakahlia' },
      { label: 'الشرقية', value: 'sharqia' },
    ]);
  }

  loadCustomerSources() {
    this.potentialCustomerService.getSources().subscribe({
      next: (response) => {
        const sources = response?.data?.sources ?? [];
        const mapped = Array.isArray(sources)
          ? sources.map((s: any) => ({
              label: s.label ?? s.name ?? String(s.value ?? ''),
              value: s.value ?? s.id ?? s.name ?? '',
            }))
          : [];
        this.customerSources.set(mapped);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading sources:', error);
        this.customerSources.set([]);
        this.cdr.markForCheck();
      },
    });
  }

  closeDialog(data?: any) {
    this.ref.close(data);
  }

  saveAndClose() {
    if (this.customerForm.valid && !this.isLoading()) {
      this.isLoading.set(true);

      const formValue = this.customerForm.value;
      const payload = {
        name: formValue.name,
        activity_name: formValue.activity_name,
        phone: formValue.phone,
        city: formValue.city,
        governorate: formValue.governorate,
        street_name: formValue.street_name,
        notes: formValue.notes || '',
        source: formValue.source,
        assigned_employee_id: formValue.assigned_employee_id || undefined,
        // group_ids: formValue.group_ids ?? [[]],
      };

      this.potentialCustomerService
        .updateLead(this.leadId, payload)
        .pipe(finalize(() => this.isLoading.set(false)))
        .subscribe({
          next: (response) => {
            const result = {
              success: true,
              data: response,
            };
            this.closeDialog(result);
          },
          error: (error) => {
            console.error('Error updating lead:', error);
            this.cdr.markForCheck();
          },
        });
    }
  }
}