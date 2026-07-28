import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SharedTextInputComponent } from '../../../../shared/components/shared-text-input/shared-text-input.component';
import { SharedSelectComponent } from '../../../../shared/components/shared-select/shared-select.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CommonModule } from '@angular/common';
import { takeUntil } from 'rxjs';
import { RolesService } from '../../services/roles.service';
import { BaseComponent } from '../../../../shared/services/base.component';
import { PermissionsService } from '../../services/permissions.service';
import { PermissionCategory } from '../../models/permissions.model';

@Component({
  selector: 'app-add-new-user-to-existing-merchant',
  imports: [
    SharedTextInputComponent,
    SharedSelectComponent,
    ReactiveFormsModule,
    FormsModule,
    ToggleSwitchModule,
    CommonModule,
  ],
  templateUrl: './add-new-user-to-existing-merchant.html',
  styleUrl: './add-new-user-to-existing-merchant.scss',
})
export class AddNewUserToExistingMerchant extends BaseComponent implements OnInit {
  userForm!: FormGroup;
  selectedRole: string = '';

  emailOptions = [
    { label: 'john.doe@example.com', value: 'john.doe@example.com' },
    { label: 'jane.smith@example.com', value: 'jane.smith@example.com' },
    { label: 'admin@example.com', value: 'admin@example.com' },
  ];

  roleOptions: any = [];

  // Real permissions, loaded from the API
  permissionCategories: PermissionCategory[] = [];
  // Currently selected permission ids (kept in sync with the form control)
  selectedPermissionIds = new Set<number>();

  constructor(
    private fb: FormBuilder,
    private roleService: RolesService,
    private permissionsService: PermissionsService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.onGetRoles();
    this.onGetPermissions();

    this.userForm = this.fb.group({
      store_id: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['', Validators.required],
      is_custom_permissions: [0], // 0 = false, 1 = true
      permission_ids: [[] as number[]], // flat array of permission IDs
    });

    this.userForm.get('role')?.valueChanges.subscribe((role) => {
      this.selectedRole = role;
    });
  }

  onGetRoles() {
    this.roleService
      .getRoles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const flatRoles = res.data.flat();
          this.roleOptions = flatRoles.map((role) => ({
            label: role.name,
            value: role.id,
          }));
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching roles:', err);
        },
      });
  }

  onGetPermissions() {
    this.permissionsService
      .getPermissions()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.permissionCategories = res.data.permissions ?? [];
          console.log(res);
          console.log(this.permissionCategories);

          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching permissions:', err);
        },
      });
  }

  isPermissionSelected(id: number): boolean {
    return this.selectedPermissionIds.has(id);
  }

  togglePermission(id: number, checked: boolean) {
    if (checked) {
      this.selectedPermissionIds.add(id);
    } else {
      this.selectedPermissionIds.delete(id);
    }

    const ids = Array.from(this.selectedPermissionIds);
    this.userForm.patchValue({
      permission_ids: ids,
      is_custom_permissions: ids.length > 0 ? 1 : 0,
    });
  }

  onSubmit() {
    console.log(this.userForm.value);
    
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const formValue = this.userForm.value;
    
    const payload = {
      store_id: Number(formValue.store_id),
      name: formValue.name,
      email: formValue.email,
      phone: formValue.phone,
      password: formValue.password,
      role: formValue.role,
      is_custom_permissions: formValue.is_custom_permissions,
      permission_ids: formValue.permission_ids,
    };

    console.log('Submitting payload:', payload);

    // this.userService.createUser(payload).subscribe({
    //   next: (res) => {
    //     console.log('User created:', res);
    //   },
    //   error: (err) => {
    //     console.error('Error creating user:', err);
    //   },
    // });
  }
}
