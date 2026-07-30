import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { MenuItem, ConfirmationService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MenuModule, Menu } from 'primeng/menu';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { takeUntil } from 'rxjs';
import { BaseComponent } from '../../../../shared/services/base.component';
import { PricingAndPlansService } from './services/pricing-and-plans.service';
import { Plan } from './models/pricing-and-plans.model';
import { PlanDialog } from './components/plan-dialog/plan-dialog';

interface DisplayFeature {
  label: string;
  value: string;
}

interface DisplayPricingTier {
  label: string;
  price: string;
}

@Component({
  selector: 'app-pricing-and-plans',
  imports: [
    PageHeaderComponent,
    CommonModule,
    ConfirmDialogModule,
    MenuModule,
    DynamicDialogModule,
  ],
  providers: [DialogService, ConfirmationService],
  templateUrl: './pricing-and-plans.html',
  styleUrl: './pricing-and-plans.scss',
})
export class PricingAndPlans extends BaseComponent implements OnInit {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };

  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'التسعير والباقات', routerLink: '/pricing-and-plans' },
  ];

  plans: Plan[] = [];
  isLoading = false;
  errorMessage = '';

  constructor(
    private plansService: PricingAndPlansService,
    private dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    this.onGetPlans();
  }

  onGetPlans() {
    this.isLoading = true;
    this.errorMessage = '';

    this.plansService
      .getPlans()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.plans = res.data ?? [];
          this.isLoading = false;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching plans:', err);
          this.errorMessage = 'حدث خطأ أثناء تحميل الباقات';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  trackByPlanId(_index: number, plan: Plan): number {
    return plan.id;
  }

  // Derive display "features" (limits) from the raw plan fields
  getFeatures(plan: Plan): DisplayFeature[] {
    return [
      {
        label: 'عدد المكاتب',
        value: plan.is_unlimited_offices ? 'غير محدود' : `${plan.offices_limit ?? 0} مكتب`,
      },
      {
        label: 'عدد المستخدمين',
        value: plan.is_unlimited_users ? 'غير محدود' : `${plan.users_limit ?? 0} مستخدم`,
      },
      {
        label: 'عدد المحافظ',
        value: plan.is_unlimited_wallets ? 'غير محدود' : `${plan.wallets_limit ?? 0} محفظة`,
      },
      {
        label: 'عدد الأجهزة',
        value: plan.is_unlimited_devices ? 'غير محدود' : `${plan.devices_limit ?? 0} جهاز`,
      },
    ];
  }

  getPricingTiers(plan: Plan): DisplayPricingTier[] {
    return [
      { label: 'شهري', price: `${plan.monthly_price.toLocaleString('ar-EG')} ج.م` },
      { label: 'نصف سنوي', price: `${plan.semi_annual_price.toLocaleString('ar-EG')} ج.م` },
      { label: 'سنوي', price: `${plan.yearly_price.toLocaleString('ar-EG')} ج.م` },
    ];
  }

  getContextMenu(plan: Plan) {
    return [
      {
        label: 'تعديل الباقة',
        command: () => this.onEdit(plan),
      },
      {
        label: plan.is_active ? 'إيقاف الباقة' : 'تنشيط الباقة',
        styleClass: plan.is_active ? 'text-red-600' : 'text-green-600',
        command: () => this.onToggleActive(plan),
      },
      {
        label: 'حذف الباقة',
        styleClass: 'text-red-600',
        command: () => this.onDelete(plan),
      },
    ];
  }

  // Set model imperatively right before opening — avoids the reactive-binding
  // "first click doesn't register" bug from rebuilding the menu on every CD cycle
  onMenuClick(menu: Menu, plan: Plan, event: Event) {
    event.stopPropagation();
    menu.model = this.getContextMenu(plan);
    menu.toggle(event);
  }

  onAddNew() {
    const ref = this.dialogService.open(PlanDialog, {
      header: 'إضافة باقة جديدة',
      width: '600px',
      modal: true,
      closable: true,
      breakpoints: { '960px': '75vw', '640px': '90vw' },
    });

    if (ref) {
      ref.onClose.pipe(takeUntil(this.destroy$)).subscribe((created: Plan | undefined) => {
        if (created) {
          this.onGetPlans();
        }
      });
    }
  }
  onEdit(plan: Plan) {
    this.plansService
      .getPlanById(plan.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const fetchedPlan = res.data.plan; // <-- fixed: unwrap the nested "plan" key
          console.log(fetchedPlan);

          const ref = this.dialogService.open(PlanDialog, {
            header: 'تعديل الباقة',
            width: '600px',
            modal: true,
            closable: true,
            breakpoints: { '960px': '75vw', '640px': '90vw' },
            data: { plan: fetchedPlan },
          });

          if (ref) {
            ref.onClose.pipe(takeUntil(this.destroy$)).subscribe((updated: Plan | undefined) => {
              if (updated) {
                this.onGetPlans();
              }
            });
          }
        },
        error: (err) => console.error('Error fetching plan:', err),
      });
  }

  onToggleActive(plan: Plan) {
    const payload = {
      name: plan.name,
      offices_limit: plan.offices_limit,
      users_limit: plan.users_limit,
      wallets_limit: plan.wallets_limit,
      devices_limit: plan.devices_limit,
      is_unlimited_wallets: (plan.is_unlimited_wallets ? 1 : 0) as 0 | 1,
      is_unlimited_users: (plan.is_unlimited_users ? 1 : 0) as 0 | 1,
      is_unlimited_offices: (plan.is_unlimited_offices ? 1 : 0) as 0 | 1,
      is_unlimited_devices: (plan.is_unlimited_devices ? 1 : 0) as 0 | 1,
      monthly_price: plan.monthly_price,
      semi_annual_price: plan.semi_annual_price,
      yearly_price: plan.yearly_price,
      is_active: (plan.is_active ? 0 : 1) as 0 | 1, // flip
    };

    this.plansService
      .updatePlan(plan.id, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.onGetPlans();
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Error toggling plan status:', err),
      });
  }

  onDelete(plan: Plan) {
    this.confirmationService.confirm({
      message: `هل أنت متأكد من حذف باقة "${plan.name}"؟`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'حذف',
      rejectLabel: 'إلغاء',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.plansService
          .deletePlan(plan.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.plans = this.plans.filter((p) => p.id !== plan.id);
              this.cdr.detectChanges();
            },
            error: (err) => console.error('Error deleting plan:', err),
          });
      },
    });
  }
}
