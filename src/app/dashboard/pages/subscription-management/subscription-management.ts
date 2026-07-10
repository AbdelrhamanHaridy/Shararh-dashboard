import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedTextInputComponent } from '../../shared/components/shared-text-input/shared-text-input.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SharedKpiCard } from '../../shared/components/shared-kpi-card/shared-kpi-card';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-subscription-management',
  imports: [SharedTextInputComponent, ReactiveFormsModule, SharedKpiCard, PageHeaderComponent],
  templateUrl: './subscription-management.html',
  styleUrl: './subscription-management.scss',
})
export class SubscriptionManagement implements OnInit {
  userForm!: FormGroup;
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };
  breadcrumbItems = [{ label: 'إدارة الاشتراكات' }];

  subscriptions = [
    {
      id: 1,
      status: 'نشطة',
      statusColor: '#10A922',
      statusBgColor: '#E8F5E9',
      merchantName: 'صيدلية الشفاء',
      subscriptionType: '6 أشهر الى سنوية',
      phone: '+20 123 456 789',
      location: 'المحلة الشرقي',
      paymentGateway: 'غير محدد',
      merchantType: 'شريك تجاري',
      displayDate: '30-12-2024',
      actionDate: '30-12-2024',
    },
    {
      id: 2,
      status: 'قيد الانتظار',
      statusColor: '#FF9500',
      statusBgColor: '#FFF4E5',
      merchantName: 'محل المزارعين',
      subscriptionType: '4 أشهر الى سنوية',
      phone: '+20 123 345 6789',
      location: 'المحلة الشرقي',
      paymentGateway: 'غير محدد',
      merchantType: 'شريك تجاري',
      displayDate: '30-12-2024',
      actionDate: '30-12-2024',
    },
    {
      id: 3,
      status: 'نشطة',
      statusColor: '#10A922',
      statusBgColor: '#E8F5E9',
      merchantName: 'مطعم الأصالة',
      subscriptionType: '6 أشهر الى سنوية',
      phone: '+20 123 456 789',
      location: 'المحلة الشرقي',
      paymentGateway: 'غير محدد',
      merchantType: 'شريك تجاري',
      displayDate: '30-12-2024',
      actionDate: '30-12-2024',
    },
    {
      id: 4,
      status: 'نشطة',
      statusColor: '#10A922',
      statusBgColor: '#E8F5E9',
      merchantName: 'سوبر ماركت النور',
      subscriptionType: '6 أشهر الى سنوية',
      phone: '+20 123 456 789',
      location: 'المحلة الشرقي',
      paymentGateway: 'غير محدد',
      merchantType: 'شريك تجاري',
      displayDate: '30-12-2024',
      actionDate: '30-12-2024',
    },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.userForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
    });
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log(this.userForm.value);
    }
  }
}
