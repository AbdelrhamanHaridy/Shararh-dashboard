import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface PlanFeature {
  label: string;
  value: string;
}

interface PricingTier {
  label: string;
  price: string;
}

interface Plan {
  id: string;
  name: string;
  badge?: string;
  featured?: boolean;
  features: PlanFeature[];
  pricingTiers: PricingTier[];
  selectedTierIndex: number;
  purchaseCount: number;
  activeSubscribers: number;
}

@Component({
  selector: 'app-subscription-plan-dialog',
  imports: [CommonModule],
  templateUrl: './subscription-plan-dialog.html',
  styleUrl: './subscription-plan-dialog.scss',
})
export class SubscriptionPlanDialog {
  private readonly maxCarouselSteps = 3;

  currentSubscription = {
    planName: 'الفتره التجريبية',
    subtitle: 'الباقة الحالية',
    statusLabel: 'مفعل',
    startDate: '2025/3/2',
    endDate: '2025/4/2',
  };

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
      selectedTierIndex: 0,
      purchaseCount: 340,
      activeSubscribers: 15,
    },
    {
      id: 'growth',
      name: 'باقة النمو',
      badge: 'الأكثر اختياراً',
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
      selectedTierIndex: 0,
      purchaseCount: 340,
      activeSubscribers: 15,
    },
    {
      id: 'full',
      name: 'الباقة الشاملة',
      featured: true,
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
      selectedTierIndex: 0,
      purchaseCount: 340,
      activeSubscribers: 15,
    },
  ];

  activeIndex = 0;

  get carouselPlans(): Plan[] {
    return this.plans.slice(0, this.maxCarouselSteps);
  }

  get totalSteps(): number {
    return this.carouselPlans.length;
  }

  get canPrev(): boolean {
    return this.activeIndex > 0;
  }

  get canNext(): boolean {
    return this.activeIndex < this.totalSteps - 1;
  }

  get trackTransform(): string {
    return `translateX(-${this.activeIndex * 100}%)`;
  }

  prevSlide(): void {
    if (this.canPrev) {
      this.activeIndex -= 1;
    }
  }

  nextSlide(): void {
    if (this.canNext) {
      this.activeIndex += 1;
    }
  }

  goToSlide(index: number): void {
    const maxIndex = this.totalSteps - 1;
    this.activeIndex = Math.min(Math.max(index, 0), maxIndex);
  }

  selectTier(plan: Plan, tierIndex: number): void {
    plan.selectedTierIndex = tierIndex;
  }

  onExploreOtherPlans(): void {
    // TODO: navigate to full plans comparison view
  }

  onClose(): void {
    // TODO: close dialog
  }

  onUpdatePlan(): void {
    const plan = this.carouselPlans[this.activeIndex];
    const tier = plan.pricingTiers[plan.selectedTierIndex];
    console.log('Updating to', plan.name, tier.label);
    // TODO: call API to update the subscription
  }
}
