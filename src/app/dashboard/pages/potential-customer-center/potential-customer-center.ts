import { Component, input, output } from '@angular/core';
import {
  Subscription,
  SubscriptionCard,
} from '../subscription-management/components/subscription-card/subscription-card';
import { MenuItem } from 'primeng/api';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SharedKpiCard } from '../../shared/components/shared-kpi-card/shared-kpi-card';

@Component({
  selector: 'app-potential-customer-center',
  imports: [SharedKpiCard, PageHeaderComponent, SubscriptionCard],
  templateUrl: './potential-customer-center.html',
  styleUrl: './potential-customer-center.scss',
})
export class PotentialCustomerCenter {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };
  breadcrumbItems = [{ label: 'مركز العملاء المحتملين' }];

  customers = [
    {
      id: 1,
      name: 'أحمد محمد العتيبي',
      avatarUrl: 'assets/testing/avatar.png',
      status: 'محتمل',
      statusColor: '#B4630D',
      statusBgColor: '#FFEDC3',
      city: 'القاهرة',
      country: 'مصر',
      acceptedDate: '12 مارس 2026 ، 05:00 م',
      phone: '+20 100 234 5678',
      assignedEmployee: 'محمد الشمري',
      notes: 'يحتاج إلى معاينة الموقع للتأكد من المساحات المتاحة قبل البدء في التنفيذ...',
    },
    {
      id: 2,
      name: 'أحمد محمد العتيبي',
      avatarUrl: 'assets/testing/avatar.png',
      status: 'محتمل',
      statusColor: '#B4630D',
      statusBgColor: '#FFEDC3',
      city: 'القاهرة',
      country: 'مصر',
      acceptedDate: '12 مارس 2026 ، 05:00 م',
      phone: '+20 100 234 5678',
      assignedEmployee: 'محمد الشمري',
      notes: 'يحتاج إلى معاينة الموقع للتأكد من المساحات المتاحة قبل البدء في التنفيذ...',
    },
    {
      id: 3,
      name: 'أحمد محمد العتيبي',
      avatarUrl: 'assets/testing/avatar.png',
      status: 'محتمل',
      statusColor: '#B4630D',
      statusBgColor: '#FFEDC3',
      city: 'القاهرة',
      country: 'مصر',
      acceptedDate: '12 مارس 2026 ، 05:00 م',
      phone: '+20 100 234 5678',
      assignedEmployee: 'محمد الشمري',
      notes: 'يحتاج إلى معاينة الموقع للتأكد من المساحات المتاحة قبل البدء في التنفيذ...',
    },
    {
      id: 4,
      name: 'أحمد محمد العتيبي',
      avatarUrl: 'assets/testing/avatar.png',
      status: 'محتمل',
      statusColor: '#B4630D',
      statusBgColor: '#FFEDC3',
      city: 'القاهرة',
      country: 'مصر',
      acceptedDate: '12 مارس 2026 ، 05:00 م',
      phone: '+20 100 234 5678',
      assignedEmployee: 'محمد الشمري',
      notes: 'يحتاج إلى معاينة الموقع للتأكد من المساحات المتاحة قبل البدء في التنفيذ...',
    },
  ];
  ngOnInit() {}

  copyToClipboard(phone: string) {
    navigator.clipboard.writeText(phone).then(() => {
      // alert('تم نسخ رقم الهاتف بنجاح');
    });
    // .catch(err => {
    //   console.error('فشل نسخ رقم الهاتف:', err);
    // });
  }
  subscription = input.required<Subscription>();
  copyPhone = output<string>();

  onViewDetails(subscriptionId: number) {
    console.log('View details for subscription:', subscriptionId);
    // Add navigation logic here
  }
  onCopyPhone() {
    this.copyPhone.emit(this.subscription().phone);
  }
}
