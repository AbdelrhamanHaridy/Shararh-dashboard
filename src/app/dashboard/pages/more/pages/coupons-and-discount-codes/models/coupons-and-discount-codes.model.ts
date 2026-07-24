export interface CouponListResponse {
  success: boolean;
  status: number;
  message: string;
  data: Coupon[];
  pagination: Pagination;
}

export interface Coupon {
  id: number;
  code: string;
  title: string;
  description: string;
  discountType: string;
  discountTypeLabel: string;
  discountValue: number;
  maxDiscountAmount?: number;
  usageLimit?: number;
  usedCount: number;
  targetType: string;
  targetTypeLabel: string;
  startsAt: string;
  expiresAt?: string;
  status: string;
  statusLabel: string;
  isDateExpired: boolean;
  isEffectivelyActive: boolean;
  createdBy: number;
  creator: Creator;
  applicablePlans: any[];
  createdAt: string;
  updatedAt: string;
}

export interface Creator {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
}

export interface Pagination {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number;
  to: number;
  hasMorePages: boolean;
}

export interface CouponStats {
  total_coupons: number;
  total_usage_count: number;
  total_discount_amount: number;
  active_coupons_count: number;
  formatted: {
    total_discount_amount: string;
    total_usage_count: string;
    total_coupons: string;
    active_coupons_count: string;
  };
}

export interface CouponStatsResponse {
  success: boolean;
  status: number;
  message: string;
  data: CouponStats;
}
