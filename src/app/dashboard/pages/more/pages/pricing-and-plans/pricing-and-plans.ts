import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';
export interface PlanFeature {
  label: string;
  value: string;
}

export interface PlanPricingTier {
  label: string;
  price: string;
}

export interface Plan {
  id: string;
  name: string;
  badge?: string; // e.g. "الأكثر اختياراً"
  featured?: boolean; // highlights the card with the green border
  features: PlanFeature[];
  pricingTiers: PlanPricingTier[];
  purchaseCount: number;
  activeSubscribers: number;
}
@Component({
  selector: 'app-pricing-and-plans',
  imports: [PageHeaderComponent, CommonModule],
  templateUrl: './pricing-and-plans.html',
  styleUrl: './pricing-and-plans.scss',
})
export class PricingAndPlans {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };

  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'التسعير والباقات', routerLink: '/pricing-and-plans' },
  ];
  plans: Plan[] = [
    {
      id: 'basic',
      name: 'الباقة الأساسية',
      features: [
        { label: 'عدد المكاتب', value: '1 مكتب رئيسي' },
        { label: 'عدد المستخدمين', value: '5 مستخدمين' },
        { label: 'عدد المحافظ', value: '20 محفظه' },
        { label: 'عدد الأجهزة', value: '7 اجهزه' },
      ],
      pricingTiers: [
        { label: 'شهري', price: '299 ج.م' },
        { label: 'نصف سنوي', price: '1,499 ج.م' },
        { label: 'سنوي', price: '2,499 ج.م' },
      ],
      purchaseCount: 340,
      activeSubscribers: 15,
    },
    {
      id: 'growth',
      name: 'باقة النمو',
      badge: 'الأكثر اختياراً',
      featured: true,
      features: [
        { label: 'عدد المكاتب', value: 'حتى 3 مكاتب' },
        { label: 'عدد المستخدمين', value: '15 مستخدم' },
        { label: 'عدد المحافظ', value: 'غير محدود' },
        { label: 'عدد الأجهزة', value: '20 جهاز' },
      ],
      pricingTiers: [
        { label: 'شهري', price: '499 ج.م' },
        { label: 'نصف سنوي', price: '2,499 ج.م' },
        { label: 'سنوي', price: '3,999 ج.م' },
      ],
      purchaseCount: 340,
      activeSubscribers: 15,
    },
    {
      id: 'full',
      name: 'الباقة الشاملة',
      features: [
        { label: 'عدد المكاتب', value: 'غير محدود' },
        { label: 'عدد المستخدمين', value: 'غير محدود' },
        { label: 'عدد المحافظ', value: 'غير محدود' },
        { label: 'عدد الأجهزة', value: 'غير محدود' },
      ],
      pricingTiers: [
        { label: 'شهري', price: '699 ج.م' },
        { label: 'نصف سنوي', price: '3,499 ج.م' },
        { label: 'سنوي', price: '5,499 ج.م' },
      ],
      purchaseCount: 340,
      activeSubscribers: 15,
    },
  ];
}
