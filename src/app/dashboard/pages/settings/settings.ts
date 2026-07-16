import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SharedSelectComponent } from '../../shared/components/shared-select/shared-select.component';
import { SharedTextInputComponent } from '../../shared/components/shared-text-input/shared-text-input.component';

@Component({
  selector: 'app-settings',
  imports: [
    PageHeaderComponent,
    SharedTextInputComponent,
    SharedSelectComponent,
    ReactiveFormsModule,
    ToggleSwitchModule,
    CommonModule,
  ],
  templateUrl: './settings.html',
  styleUrl: './settings.scss',
})
export class Settings {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };
  userForm!: FormGroup;

  breadcrumbItems: MenuItem[] = [
    { label: 'الإعدادات' },
  ];
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      branch: ['', Validators.required],
      phone: [''],
      governorate: [''],
      city: [''],
      postalCode: [''],
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
