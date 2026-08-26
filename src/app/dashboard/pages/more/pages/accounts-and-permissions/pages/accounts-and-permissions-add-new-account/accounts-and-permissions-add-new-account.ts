import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../../../../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { SharedTextInputComponent } from '../../../../../../shared/components/shared-text-input/shared-text-input.component';
import { SharedSelectComponent } from '../../../../../../shared/components/shared-select/shared-select.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Router } from '@angular/router';
import { forkJoin, takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../../../shared/services/base.component';
import { AccountsAndPermissionsService } from '../../services/accounts-and-permissions.service';
import {
  EmployeeRole,
  PermissionCategory,
  CreateEmployeePayload,
} from '../../models/accounts-and-permissions-add-new-account.model';

@Component({
  selector: 'app-accounts-and-permissions-add-new-account',
  imports: [
    PageHeaderComponent,
    SharedTextInputComponent,
    SharedSelectComponent,
    ReactiveFormsModule,
    ToggleSwitchModule,
    CommonModule,
  ],
  templateUrl: './accounts-and-permissions-add-new-account.html',
  styleUrl: './accounts-and-permissions-add-new-account.scss',
})
export class AccountsAndPermissionsAddNewAccount extends BaseComponent implements OnInit {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/home' };
  userForm!: FormGroup;
  isSubmitting = false;
  isLoadingOptions = false;
  errorMessage = '';

  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'الحسابات والصلاحيات', routerLink: '/accounts-and-permissions' },
    { label: 'إضافة حساب جديد', routerLink: '/more/accounts-and-permissions/add-new-account' },
  ];

  roleOptions: { label: string; value: string }[] = [];
  roles: EmployeeRole[] = [];

  permissionsModeOptions = [
    { label: 'صلاحيات محدودة', value: 'limited_access' },
    { label: 'صلاحيات كاملة', value: 'full_access' },
  ];

  permissionsCatalog: PermissionCategory[] = [];
  selectedPermissions = new Set<string>();

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private accountsService: AccountsAndPermissionsService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      branch: ['', Validators.required],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      permissions_mode: ['limited_access', Validators.required],
    });

    this.loadOptions();

    // When the role changes, preselect that role's default permissions
    // (still editable afterward — this is just a helpful starting point)
    this.userForm
      .get('role')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((roleName) => {
        const role = this.roles.find((r) => r.name === roleName);
        this.selectedPermissions = new Set(role?.permissions ?? []);
        this.cdr.detectChanges();
      });
  }

  loadOptions() {
    this.isLoadingOptions = true;

    forkJoin({
      roles: this.accountsService.getRoles(),
      permissions: this.accountsService.getPermissionsCatalog(),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ({ roles, permissions }) => {
          this.roles = roles.data.roles;
          this.roleOptions = this.roles.map((r) => ({ label: r.label, value: r.name }));
          this.permissionsCatalog = permissions.data.permissions;
          this.isLoadingOptions = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error loading roles/permissions:', err);
          this.errorMessage = 'حدث خطأ أثناء تحميل الأدوار والصلاحيات';
          this.isLoadingOptions = false;
          this.cdr.detectChanges();
        },
      });
  }

  get isLimitedAccess(): boolean {
    return this.userForm.get('permissions_mode')?.value === 'limited_access';
  }

  isPermissionSelected(key: string): boolean {
    return this.selectedPermissions.has(key);
  }

  togglePermission(key: string, checked: boolean) {
    if (checked) {
      this.selectedPermissions.add(key);
    } else {
      this.selectedPermissions.delete(key);
    }
  }

  private splitName(fullName: string): { first_name: string; last_name: string } {
    const trimmed = fullName.trim();
    const spaceIndex = trimmed.indexOf(' ');
    if (spaceIndex === -1) {
      return { first_name: trimmed, last_name: '' };
    }
    return {
      first_name: trimmed.slice(0, spaceIndex),
      last_name: trimmed.slice(spaceIndex + 1),
    };
  }

  onSubmit() {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.userForm.value;
    const { first_name, last_name } = this.splitName(formValue.fullName);

    const payload: CreateEmployeePayload = {
      first_name,
      last_name,
      email: formValue.email,
      phone: formValue.phone,
      password: formValue.password,
      role: formValue.role,
      permissions_mode: formValue.permissions_mode,
      permissions:
        formValue.permissions_mode === 'limited_access' ? Array.from(this.selectedPermissions) : [],
    };

    this.accountsService
      .createEmployee(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isSubmitting = false;
          this.router.navigate(['/more/accounts-and-permissions']);
        },
        error: (err) => {
          console.error('Error creating employee:', err);
          this.isSubmitting = false;
          this.errorMessage = 'حدث خطأ أثناء إضافة الحساب، حاول مرة أخرى';
        },
      });
  }

  onCancel() {
    this.router.navigate(['/more/accounts-and-permissions']);
  }
}
