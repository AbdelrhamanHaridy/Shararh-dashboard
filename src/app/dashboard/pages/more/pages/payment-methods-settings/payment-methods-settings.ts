import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-payment-methods-settings',
  imports: [PageHeaderComponent],
  templateUrl: './payment-methods-settings.html',
  styleUrl: './payment-methods-settings.scss',
})
export class PaymentMethodsSettings {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };
  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'إعدادات وسائل الدفع', routerLink: '/payment-methods-settings' },
  ];

  // Dummy merchants data for the merchant boxes preview
  paymentMethods = [
    {
      id: 99,
      name: 'تفاصيل الخصم',
      time: 'تفعيل لحظي',
    },
    {
      id: 100,
      name: 'فوري باي',
      time: 'تفعيل لحظي',
    },
    {
      id: 101,
      name: 'محفظه الكترونيه',
      time: 'تفعيل لحظي',
      data: [
        {
          name: 'رقم المحفظه',
          value: '01032060389',
        },
        {
          name: 'الاسم',
          value: 'عبدالله رفعت عبدالحميد',
        },
        {
          name: 'النسبه',
          value: '% 1',
        },
      ],
    },
    {
      id: 102,
      name: 'تحويل بنكي / ايداع بنكي ',
      time: 'تفعيل لحظي',
      data: [
        {
          name: 'المرجع',
          value: 'abdallahsharara1',
        },
        {
          name: 'رقم الحساب',
          value: '207112774001',
        },
        {
          name: 'البنك',
          value: 'بنك الاسكندرية',
        },
        {
          name: 'المستفيد',
          value: 'عبدالله رفعت عبدالحميد',
        },
      ],
    },
    // {
    //   id: 102,
    //   name: 'صيدلية الشفاء',
    //   time: 'يستغرق يوم عمل 1 بعد استلام الاموال',
    //   apps: [
    //     {
    //       id: 'm102-a1',
    //       badgeLabel: 'محدث',
    //       badgeColor: '#065F46',
    //       badgeBgColor: '#ECFDF5',
    //       name: 'النقطة',
    //       devicesCount: 3,
    //       version: '2.0.1',
    //       iconUrl: 'assets/icons/global/blue_check.svg',
    //     },
    //   ],
    // },
    // {
    //   id: 103,
    //   name: 'مطعم الأصالة',
    //   time: 'المنطقة الصناعية',
    //   apps: [
    //     {
    //       id: 'm103-a1',
    //       badgeLabel: 'قيد التحديث',
    //       badgeColor: '#B45309',
    //       badgeBgColor: '#FFFAEB',
    //       name: 'خدمة الطلبات',
    //       devicesCount: 8,
    //       version: '1.0.0',
    //       iconUrl: 'assets/icons/global/blue_check.svg',
    //     },
    //   ],
    // },
  ];
}
