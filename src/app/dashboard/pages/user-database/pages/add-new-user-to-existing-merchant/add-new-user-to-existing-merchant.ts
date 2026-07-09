import { Component, OnInit } from '@angular/core';
import { SharedTextInputComponent } from '../../../../shared/components/shared-text-input/shared-text-input.component';
import { SharedSelectComponent } from '../../../../shared/components/shared-select/shared-select.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-new-user-to-existing-merchant',
  imports: [
    SharedTextInputComponent,
    SharedSelectComponent,
    ReactiveFormsModule,
    ToggleSwitchModule,
    CommonModule,
  ],
  templateUrl: './add-new-user-to-existing-merchant.html',
  styleUrl: './add-new-user-to-existing-merchant.scss',
})
export class AddNewUserToExistingMerchant implements OnInit {
  userForm!: FormGroup;
  selectedRole: string = '';

  emailOptions = [
    { label: 'john.doe@example.com', value: 'john.doe@example.com' },
    { label: 'jane.smith@example.com', value: 'jane.smith@example.com' },
    { label: 'admin@example.com', value: 'admin@example.com' },
  ];

  
  roleOptions = [
    { label: 'مندوب', value: 'مندوب' },
    { label: 'كاشير', value: 'كاشير' },
    { label: 'شريك', value: 'شريك' },
    { label: 'محاسب', value: 'محاسب' },
  ];

  // Permission groups based on role
  permissions: any = {
    'كاشير': {
      'مديونيات': [
        'تسجيل تسليم أموال',
        'إضافة مديونيه او تسجيل تحصيل لحساب المديونيه',
        'تعديل رصيد حساب مديونيه',
        'تعديل عمليه داخل او خارج الورديه',
        'حذف عمليه لحساب مديونيه',
        'حذف حساب مديونيه',
      ],
      'ورديات': [
        'فتح ورديه',
        'انهاء ورديه',
        'التعديل علي وردية قديمة',
        'تعديل عمليه داخل او خارج الورديه',
        'حذف عملية داخل او خارج الوردية',
      ],
      'محافظ': [
        'اجراء تحويلات', 
        'اضافة محفظة جديدة لاول مرة', 
        'حذف محفظة من الوردية'
      ],
    },
    'مندوب': {
      'مديونيات': [
        'الوصول لعملاء المديونية',
        'إضافة مديونيه او تسجيل تحصيل لحساب المديونيه',
        'تعديل رصيد حساب مديونيه',
        'تعديل بيانات عميل',
        'حذف عمليه لحساب مديونيه',
        'حذف حساب مديونيه',
      ],
    },
    'شريك': {
      'الاشعارات': [
        'عرض الإشعارات المالية',
        'عرض التنبيهات'
      ],
      'الورديات ودوريات التحصيل': [
        'الوصول لبيانات الورديات ودوريات التحصيل',
        'تعديل بيانات الوردية',
        'تعديل بيانات دورية تحصيل',
        'حذف وردية مغلقة',
        'الوصول لعملاء المديونية',
        'انشاء مجموعة',
        'إضافة مديونيه او تسجيل تحصيل لحساب المديونيه',
        'تعديل رصيد حساب مديونيه',
        'تعديل بيانات عميل',
        'حذف عمليه لحساب مديونيه',
        'حذف حساب مديونيه'
      ],
      'المديونيات': [
        'الوصول لعملاء المديونية',
        'انشاء مجموعة',
        'إضافة مديونيه او تسجيل تحصيل لحساب المديونيه',
        'تعديل رصيد حساب مديونيه',
        'تعديل بيانات عميل',
        'حذف عمليه لحساب مديونيه',
        'حذف حساب مديونيه'
      ],
      'المحافظ': [
        'الوصول لقائمة المحافظ',
        'اضافة محفظة',
        'تعديل بيانات محفظة',
        'تعديل رصيد محفظة',
        'حذف محفظة'
      ],
      'التقفيل والمراجعه': [
        'الوصول لصفحة التقفيل والمراجعة',
        'مراجعة كل الاوعية',
        'اعتماد الرصيد',
        'ادخال رصيد مختلف',
        'اعتماد التقفيل',
        'حذف تقفيل قديم'
      ]
    },
    'محاسب': {
      'الاشعارات': [
        'عرض الإشعارات المالية',
        'عرض التنبيهات'
      ],
      'الورديات ودوريات التحصيل': [
        'الوصول لبيانات الورديات ودوريات التحصيل',
        'تعديل بيانات الوردية',
        'تعديل بيانات دورية تحصيل',
        'حذف وردية مغلقة',
        'الوصول لعملاء المديونية',
        'انشاء مجموعة',
        'إضافة مديونيه او تسجيل تحصيل لحساب المديونيه',
        'تعديل رصيد حساب مديونيه',
        'تعديل بيانات عميل',
        'حذف عمليه لحساب مديونيه',
        'حذف حساب مديونيه'
      ],
      'المديونيات': [
        'الوصول لعملاء المديونية',
        'انشاء مجموعة',
        'إضافة مديونيه او تسجيل تحصيل لحساب المديونيه',
        'تعديل رصيد حساب مديونيه',
        'تعديل بيانات عميل',
        'حذف عمليه لحساب مديونيه',
        'حذف حساب مديونيه'
      ],
      'المحافظ': [
        'الوصول لقائمة المحافظ',
        'اضافة محفظة',
        'تعديل بيانات محفظة',
        'تعديل رصيد محفظة',
        'حذف محفظة'
      ],
      'التقفيل والمراجعه': [
        'الوصول لصفحة التقفيل والمراجعة',
        'مراجعة كل الاوعية',
        'اعتماد الرصيد',
        'ادخال رصيد مختلف',
        'اعتماد التقفيل',
        'حذف تقفيل قديم'
      ]
    }
  };
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      branch: ['', Validators.required],
      phone: [''],
      role: ['', Validators.required],
    });

    // Listen to role changes
    this.userForm.get('role')?.valueChanges.subscribe((role) => {
      this.selectedRole = role;
    });
  }

  // Helper method to get permission categories for selected role
  getPermissionCategories(): string[] {
    if (!this.selectedRole || !this.permissions[this.selectedRole]) {
      return [];
    }
    return Object.keys(this.permissions[this.selectedRole]);
  }

  // Helper method to get permissions for a specific category
  getPermissionsForCategory(category: string): string[] {
    if (!this.selectedRole || !this.permissions[this.selectedRole]) {
      return [];
    }
    return this.permissions[this.selectedRole][category] || [];
  }

  // Check if a role has any permissions
  hasPermissions(): string | boolean {
    return this.selectedRole && !!this.permissions[this.selectedRole];
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    }
  }
}
