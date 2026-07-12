import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SharedKpiCard } from '../../shared/components/shared-kpi-card/shared-kpi-card';
import { SharedSelectComponent } from '../../shared/components/shared-select/shared-select.component';
import { SharedTextInputComponent } from '../../shared/components/shared-text-input/shared-text-input.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-complaints-and-suggestions',
  imports: [
    PageHeaderComponent,
    SharedKpiCard,
    SharedSelectComponent,
    SharedTextInputComponent,
    ReactiveFormsModule,
    CommonModule,
  ],
  templateUrl: './complaints-and-suggestions.html',
  styleUrl: './complaints-and-suggestions.scss',
})
export class ComplaintsAndSuggestions {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };
  breadcrumbItems: MenuItem[] = [
    { label: 'الشكاوى والاقتراحات', routerLink: '/complaints-and-suggestions' },
  ];
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
  contactForm!: FormGroup;

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
