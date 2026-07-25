import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CouponsAndDiscountCodesService } from './services/coupons-and-discount-codes.service';
import { takeUntil } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { SharedTableComponent } from '../../../../shared/components/shared-table/shared-table.component';
import { SharedKpiCard } from '../../../../shared/components/shared-kpi-card/shared-kpi-card';
import { Router } from '@angular/router';
import { BaseComponent } from '../../../../shared/services/base.component';
import { Coupon, CouponStats } from './models/coupons-and-discount-codes.model';

@Component({
  selector: 'app-coupons-and-discount-codes',
  imports: [PageHeaderComponent, SharedTableComponent, SharedKpiCard],
  templateUrl: './coupons-and-discount-codes.html',
  styleUrl: './coupons-and-discount-codes.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CouponsAndDiscountCodes extends BaseComponent {
  private router = inject(Router);
  private couponsService = inject(CouponsAndDiscountCodesService);

  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/dashboard' };

  breadcrumbItems: MenuItem[] = [
    { label: 'المزيد' },
    { label: 'كوبونات واكواد الخصم', routerLink: '/coupons-and-discount-codes' },
  ];

  columns = [
    { field: 'code', header: 'الكوبون', style: { color: '#1A1C18' } },
    { field: 'target_type_label', header: 'المستهدفين', style: { color: '#1A1C18' } },
    { field: 'creatorFullName', header: 'المسؤول', style: { color: '#1A1C18' } },
    {
      field: 'used_count',
      header: 'عدد المستخدمين',
      style: { fontWeight: 'bold', fontSize: '14px', color: '#1A1C18' },
    },
    { field: 'created_at', header: 'تاريخ الإنشاء' },
    { field: 'lastUsed', header: 'آخر استخدام' },
    { field: 'discount_value', header: 'الخصومات', style: { color: '#1A1C18' } },
    { field: 'coupon_status', header: 'الحالة' },
    { field: 'coupon_actions', header: '' },
  ];

  coupons = signal<Coupon[]>([]);
  totalCoupons = computed(() => this.coupons().length);
  stats = signal<CouponStats | null>(null);

  ngOnInit(): void {
    this.loadCoupons();
    this.loadStats();
  }

  private loadCoupons(): void {
    // this.isLoading.set(true);
    this.couponsService
      .getCoupons()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.coupons.set(
            data.data.map((coupon) => ({
              ...coupon,
              creatorFullName: coupon.creator.full_name,
              coupon_status: coupon.status,
            })),
          );
          // this.isLoading.set(false);
        },
        error: () => {
          // this.isLoading.set(false);
        },
      });
  }

  private loadStats(): void {
    this.couponsService
      .getCouponStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.stats.set(response.data);
        },
        error: () => {
          // Handle error
        },
      });
  }

  onAddCoupon(): void {
    this.router.navigate(['/coupons/add-new-coupon']);
  }

  onRowClick(row: any): void {
    this.router.navigate(['/coupons/coupon-details', row.code]);
  }

  onActionClick(event: { action: string; row: any }): void {
    const { action, row } = event;

    switch (action) {
      case 'edit':
        this.editCoupon(row);
        break;
      case 'editTargetCustomers':
        this.editTargetCustomers(row);
        break;
      case 'assignManager':
        this.assignManager(row);
        break;
      case 'toggleStatus':
        this.toggleCouponStatus(row);
        break;
    }
  }

  private editCoupon(row: any): void {
    this.router.navigate(['/coupons/edit', row.id]);
  }

  private editTargetCustomers(row: any): void {
    this.router.navigate(['/coupons/edit-target-customers', row.id]);
  }

  private assignManager(row: any): void {
    this.router.navigate(['/coupons/assign-manager', row.id]);
  }

  private toggleCouponStatus(row: any): void {
    const newStatus = row.coupon_status === 'active' ? 'inactive' : 'active';
    this.couponsService
      .toggleCouponStatus(row.id, newStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          // Update the row status
          row.coupon_status = newStatus;
          // Reload stats
          this.loadStats();
        },
        error: () => {
          // Handle error
        },
      });
  }
}
