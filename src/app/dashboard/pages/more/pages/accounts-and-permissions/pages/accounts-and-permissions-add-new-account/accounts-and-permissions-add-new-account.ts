import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../../../../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { SharedTextInputComponent } from '../../../../../../shared/components/shared-text-input/shared-text-input.component';
import { SharedSelectComponent } from '../../../../../../shared/components/shared-select/shared-select.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

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
export class AccountsAndPermissionsAddNewAccount {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };
  userForm!: FormGroup;

  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'الحسابات والصلاحيات', routerLink: '/accounts-and-permissions' },
    { label: 'إضافة حساب جديد', routerLink: '/more/accounts-and-permissions/add-new-account' },
  ];
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      branch: ['', Validators.required],
      phone: [''],
      role: ['', Validators.required],
    });

    // // Listen to role changes
    // this.userForm.get('role')?.valueChanges.subscribe((role) => {
    //   this.selectedRole = role;
    // });
  }
  roleOptions = [
    { label: 'مندوب', value: 'مندوب' },
    { label: 'كاشير', value: 'كاشير' },
    { label: 'شريك', value: 'شريك' },
    { label: 'محاسب', value: 'محاسب' },
  ];
  onSubmit() {}
}
