import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SharedKpiCard } from '../../shared/components/shared-kpi-card/shared-kpi-card';
import { CustomerCard } from './components/customer-card/customer-card';

@Component({
  selector: 'app-potential-customer-center',
  imports: [SharedKpiCard, PageHeaderComponent, CustomerCard],
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

  copyToClipboard(phone: string) {
    navigator.clipboard.writeText(phone).then(() => {
      // alert('تم نسخ رقم الهاتف بنجاح');
    });
  }

  onChangeStatus(customerId: number) {
    console.log('Change status for customer:', customerId);
    // Add status change logic here
  }

  onWhatsappContact(customerId: number) {
    const customer = this.customers.find((c) => c.id === customerId);
    if (customer) {
      window.open(`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`, '_blank');
    }
  }

  onPhoneCall(customerId: number) {
    const customer = this.customers.find((c) => c.id === customerId);
    if (customer) {
      window.location.href = `tel:${customer.phone}`;
    }
  }
}
