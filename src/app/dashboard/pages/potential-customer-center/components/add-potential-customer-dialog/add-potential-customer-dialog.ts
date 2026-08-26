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

@Component({
  selector: 'app-add-potential-customer-dialog',
  imports: [CommonModule, ReactiveFormsModule, SharedSelectComponent, SharedTextInputComponent],
  templateUrl: './add-potential-customer-dialog.html',
  styleUrl: './add-potential-customer-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPotentialCustomerDialog implements OnInit {
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
  statuses = signal<any[]>([]);

  ngOnInit() {
    // Initialize form (group_ids is required by the API)
    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      activity_name: ['', Validators.required],
      phone: ['', Validators.required],
      governorate: ['', Validators.required],
      city: ['', Validators.required],
      street_name: ['', Validators.required],
      source: ['', Validators.required],
      status: ['', Validators.required],
      assigned_employee_id: [''],
      notes: [''],
      // group_ids: [[[]], Validators.required], // required by API, default to [[]]
    });

    // Load options
    this.loadEmployees();
    this.loadGovernorates();
    this.loadCustomerSources();
    this.loadStatuses();
  }

  loadEmployees() {
    this.userService.getUsers().subscribe({
      next: (response) => {
        // handle multiple possible shapes: { data: { users: [...] } } or { data: [...] } or [...]
        console.log(response);
        
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
    // Example data - replace with actual API if available
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
        // API returns { data: { sources: [ { value, label }, ... ] } }
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

  loadStatuses() {
    // Example data - replace with actual API if available
    this.statuses.set([
      { label: 'جديد', value: 'new' },
      { label: 'تم الاتصال', value: 'contacted' },
      { label: 'مهتم', value: 'interested' },
      { label: 'غير مهتم', value: 'not_interested' },
    ]);
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
        status: formValue.status,
        assigned_employee_id: formValue.assigned_employee_id || undefined,
        group_ids: formValue.group_ids ?? [[]], // ensure group_ids is present
      };

      this.potentialCustomerService
        .createLead(payload)
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
            console.error('Error creating lead:', error);
            this.cdr.markForCheck();
          },
        });
    }
  }
}
