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

  activeTab: 'potential' | 'underImplementation' = 'potential';

  potentialCustomers = [
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
      name: 'سارة خالد سليمان',
      avatarUrl: 'assets/testing/avatar.png',
      status: 'محتمل',
      statusColor: '#B4630D',
      statusBgColor: '#FFEDC3',
      city: 'الرياض',
      country: 'السعودية',
      acceptedDate: '15 مارس 2026 ، 02:30 م',
      phone: '+966 50 123 4567',
      assignedEmployee: 'لين كيلر',
      notes: 'مهتمة بالتعرف على الباقات والعروض المتاحة...',
    },
  ];

  underImplementationCustomers = [
    {
      id: 3,
      name: 'خالد الشمري',
      avatarUrl: 'assets/testing/avatar.png',
      status: 'تحت التنفيذ',
      statusColor: '#137FEC',
      statusBgColor: '#E3F2FD',
      city: 'جدة',
      country: 'السعودية',
      acceptedDate: '10 مارس 2026 ، 10:00 ص',
      phone: '+966 55 987 6543',
      assignedEmployee: 'نورة السديري',
      notes: 'جاري تجهيز المعدات والأدوات اللازمة للبدء...',
    },
    {
      id: 4,
      name: 'فاطمة العتيبي',
      avatarUrl: 'assets/testing/avatar.png',
      status: 'تحت التنفيذ',
      statusColor: '#137FEC',
      statusBgColor: '#E3F2FD',
      city: 'الدمام',
      country: 'السعودية',
      acceptedDate: '08 مارس 2026 ، 03:15 م',
      phone: '+966 50 555 8888',
      assignedEmployee: 'أحمد العتيبي',
      notes: 'تم التواصل وترسيخ الطلب، في انتظار التنفيذ...',
    },
  ];

  get currentCustomers() {
    return this.activeTab === 'potential'
      ? this.potentialCustomers
      : this.underImplementationCustomers;
  }

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
    const customer = this.currentCustomers.find((c) => c.id === customerId);
    if (customer) {
      window.open(`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`, '_blank');
    }
  }

  onPhoneCall(customerId: number) {
    const customer = this.currentCustomers.find((c) => c.id === customerId);
    if (customer) {
      window.location.href = `tel:${customer.phone}`;
    }
  }

  switchTab(tab: 'potential' | 'underImplementation') {
    this.activeTab = tab;
  }

  onAcceptCustomer(customerId: number) {
    console.log('Accept customer:', customerId);
    // Add accept customer logic here
    // This could move the customer from potential to under implementation
  }
}
