import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PageHeaderComponent } from "../../../../shared/components/page-header/page-header.component";

@Component({
  selector: 'app-coupons-and-discount-codes',
  imports: [PageHeaderComponent],
  templateUrl: './coupons-and-discount-codes.html',
  styleUrl: './coupons-and-discount-codes.scss',
})
export class CouponsAndDiscountCodes {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };

  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'الأجهزة الموثوقة', routerLink: '/trusted-devices' },
  ];
}
