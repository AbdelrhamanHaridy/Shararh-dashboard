import { Component, inject } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { SharedKpiCard } from '../../../../shared/components/shared-kpi-card/shared-kpi-card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-coupons-and-discount-codes',
  imports: [PageHeaderComponent, SharedTableComponent, SharedKpiCard],
  templateUrl: './coupons-and-discount-codes.html',
  styleUrl: './coupons-and-discount-codes.scss',
})
export class CouponsAndDiscountCodes {
  private router = inject(Router);

  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };

  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'كوبونات واكواد الخصم', routerLink: '/coupons-and-discount-codes' },
  ];

  columns = [
    { field: 'couponCode', header: 'الكوبون', style: { color: '#1A1C18' } },
    { field: 'targetAudience', header: 'المستهدفين', style: { color: '#1A1C18' }  },
    { field: 'admin', header: 'المسؤول', style: { color: '#1A1C18' }  },
    { field: 'userCount', header: 'عدد المستخدمين', style: { fontWeight: 'bold', fontSize: '14px', color: '#1A1C18' } },
    { field: 'createdDate', header: 'تاريخ الإنشاء' },
    { field: 'lastUsed', header: 'آخر استخدام' },
    { field: 'discount', header: 'الخصومات', style: { color: '#1A1C18' }  },
    { field: 'status', header: 'الحالة' },
  ];

  coupons = [
    {
      couponCode: 'SAVE20',
      targetAudience: 'جميع العملاء',
      admin: 'أحمد حسن',
      userCount: 150,
      createdDate: '1 يناير 2024',
      lastUsed: '15 مارس 2024',
      discount: '20%',
      status: 'نشط',
    },
    {
      couponCode: 'WELCOME10',
      targetAudience: 'عملاء جدد',
      admin: 'محمد علي',
      userCount: 85,
      createdDate: '15 فبراير 2024',
      lastUsed: '14 مارس 2024',
      discount: '10%',
      status: 'نشط',
    },
    {
      couponCode: 'FLASH50',
      targetAudience: 'جميع العملاء',
      admin: 'عمر خالد',
      userCount: 45,
      createdDate: '1 مارس 2024',
      lastUsed: '10 مارس 2024',
      discount: '50%',
      status: 'منتهي',
    },
    {
      couponCode: 'VIP25',
      targetAudience: 'عملاء VIP',
      admin: 'يوسف نبيل',
      userCount: 30,
      createdDate: '10 يناير 2024',
      lastUsed: '5 مارس 2024',
      discount: '25%',
      status: 'نشط',
    },
    {
      couponCode: 'SUMMER15',
      targetAudience: 'جميع العملاء',
      admin: 'كريم سمير',
      userCount: 200,
      createdDate: '1 يونيو 2024',
      lastUsed: '20 يونيو 2024',
      discount: '15%',
      status: 'نشط',
    },
    {
      couponCode: 'WINTER30',
      targetAudience: 'عملاء جدد',
      admin: 'طارق فوزي',
      userCount: 60,
      createdDate: '1 ديسمبر 2023',
      lastUsed: '28 فبراير 2024',
      discount: '30%',
      status: 'منتهي',
    },
  ];

  totalCoupons = this.coupons.length;

  onAddCoupon(): void {
    this.router.navigate(['/coupons/add-new-coupon']);
  }

  onRowClick(row: any): void {
    this.router.navigate(['/coupons/coupon-details', row.couponCode]);
  }
}
