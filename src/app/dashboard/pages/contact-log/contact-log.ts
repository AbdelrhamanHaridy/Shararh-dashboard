import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SharedSelectComponent } from '../../shared/components/shared-select/shared-select.component';
import { SharedTextInputComponent } from '../../shared/components/shared-text-input/shared-text-input.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';

interface ContactLogEntry {
  id: number;
  name: string;
  time: string;
  timeAgo: string;
  direction: 'صادر' | 'وارد';
  contactType: string;
  reason: string;
  icon: string;
  iconBgColor: string;
  borderColor: string;
}

interface ContactLogDay {
  day: string;
  entries: ContactLogEntry[];
}

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

  contactLogDays: ContactLogDay[] = [
    {
      day: 'اليوم',
      entries: [
        {
          id: 1,
          name: 'أحمد محمد العتيبي',
          time: '10:45 ص',
          timeAgo: 'قبل ساعة',
          direction: 'صادر',
          contactType: 'مكالمة هاتفية',
          reason: 'استفسار',
          icon: 'pi pi-phone',
          iconBgColor: '#176B8A',
          borderColor: '#176B8A',
        },
      ],
    },
    {
      day: 'امس',
      entries: [
        {
          id: 2,
          name: 'سارة خالد سليمان',
          time: '04:20 م',
          timeAgo: '24 فبراير',
          direction: 'وارد',
          contactType: 'واتس اب',
          reason: 'تأكيد تحويل بنك',
          icon: 'pi pi-prime',
          iconBgColor: '#10A922',
          borderColor: '#10A922',
        },
        {
          id: 3,
          name: 'شركة النفيعة للتجارة',
          time: '01:15 م',
          timeAgo: '24 فبراير',
          direction: 'وارد',
          contactType: 'فيسبوك',
          reason: 'طلب تمويل',
          icon: 'pi pi-prime',
          iconBgColor: '#308FEE',
          borderColor: '#308FEE',
        },
      ],
    },
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
