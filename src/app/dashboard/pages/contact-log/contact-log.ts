import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SharedSelectComponent } from '../../shared/components/shared-select/shared-select.component';
import { SharedTextInputComponent } from '../../shared/components/shared-text-input/shared-text-input.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-contact-log',
  imports: [
    SharedTextInputComponent,
    SharedSelectComponent,
    ReactiveFormsModule,
    ToggleSwitchModule,
    CommonModule,
    PageHeaderComponent,
  ],
  templateUrl: './contact-log.html',
  styleUrl: './contact-log.scss',
})
export class ContactLog implements OnInit {
  contactForm!: FormGroup;
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };

  breadcrumbItems: MenuItem[] = [{ label: 'سجل الاتصال', routerLink: '/contact-log' }];

  contactTypeOptions = [
    { label: 'مكالمة هاتفية', value: 'phone_call' },
    { label: 'تواصل عبر البريد الالكتروني', value: 'email' },
    { label: 'جلسة وجها لوجه', value: 'meeting' },
    { label: 'رسالة نصية', value: 'sms' },
  ];

  contactViaOptions = [
    { label: 'هاتف', value: 'phone' },
    { label: 'بريد الكتروني', value: 'email' },
    { label: 'واتس اب', value: 'whatsapp' },
    { label: 'الموقع المجاني', value: 'website' },
  ];

  contactReasonOptions = [
    { label: 'متابعة عامة', value: 'followup' },
    { label: 'بحث عن مشاكل', value: 'problem' },
    { label: 'عرض ظروف', value: 'offer' },
    { label: 'استفسار', value: 'inquiry' },
    { label: 'شكوة', value: 'complaint' },
  ];
  taskStats = {
    total: 10,
    completed: 7,
    progress: 70,
  };

  suggestedTasks = [
    { id: 1, title: 'استكمال بيانات الحساب' },
    { id: 2, title: 'متابعة عميل محتمل (قيد الانتظار)' },
    { id: 3, title: 'استلام متابعة (عميل خارج المتابعة)' },
  ];
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.contactForm = this.fb.group({
      customerName: ['', Validators.required],
      customerNumber: ['', Validators.required],
      contactType: ['', Validators.required],
      contactVia: ['', Validators.required],
      contactReason: ['', Validators.required],
      notes: [''],
    });
  }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
      // Add submission logic here
    }
  }
}
