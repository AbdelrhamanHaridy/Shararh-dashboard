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
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { RolesService } from '../../services/roles.service';
import { BaseComponent } from '../../../../shared/services/base.component';
import { PermissionsService } from '../../services/permissions.service';
import { PermissionCategory } from '../../models/permissions.model';
import { StoresService } from '../../services/stores.service';
import { UserDatabaseService } from '../../services/user-database.service';

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

  roleOptions: any = [];

  storeOptions: { label: string; value: number }[] = [];
  isLoadingStores = false;
  storesErrorMessage = '';

  permissionCategories: PermissionCategory[] = [];
  selectedPermissionIds = new Set<number>();

  constructor(
    private fb: FormBuilder,
    private roleService: RolesService,
    private permissionsService: PermissionsService,
    private storesService: StoresService,
    private userService: UserDatabaseService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.onGetRoles();
    this.onGetPermissions();

    this.userForm = this.fb.group({
      organization_code: ['', Validators.required],
      store_id: [{ value: '', disabled: true }, Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      role: ['', Validators.required],
      is_custom_permissions: [0],
      permission_ids: [[] as number[]],
    });

    this.userForm.get('role')?.valueChanges.subscribe((role) => {
      this.selectedRole = role;
    });

    // Fetch stores as the user types the organization code, debounced
    this.userForm
      .get('organization_code')
      ?.valueChanges.pipe(debounceTime(500), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((code: string) => {
        this.onOrganizationCodeChange(code);
      });
  }

  onOrganizationCodeChange(code: string) {
    const storeControl = this.userForm.get('store_id');

    // Reset store selection whenever the org code changes
    storeControl?.setValue('');
    this.storeOptions = [];
    this.storesErrorMessage = '';

    const trimmed = (code || '').trim();
    if (!trimmed) {
      storeControl?.disable();
      this.cdr.detectChanges();
      return;
    }

    this.isLoadingStores = true;
    this.storesService
      .getStores(trimmed)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const stores = res.data ?? [];
          this.storeOptions = stores.map((s) => ({ label: s.name, value: s.id }));
          this.isLoadingStores = false;

          if (this.storeOptions.length > 0) {
            storeControl?.enable();
          } else {
            storeControl?.disable();
            this.storesErrorMessage = 'لا توجد فروع مرتبطة بهذا الكود';
          }
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching stores:', err);
          this.isLoadingStores = false;
          this.storesErrorMessage = 'حدث خطأ أثناء جلب الفروع، تأكد من صحة الكود';
          storeControl?.disable();
          this.cdr.detectChanges();
        },
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
            value: role.name,
            // value: role.id,
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
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }
    const formValue = this.userForm.getRawValue(); // include disabled store_id if any edge case

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

    this.userService
      .createNewUser(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('User created:', res);
        },
        error: (err) => {
          console.error('Error creating user:', err);
        },
      });
  }
}
