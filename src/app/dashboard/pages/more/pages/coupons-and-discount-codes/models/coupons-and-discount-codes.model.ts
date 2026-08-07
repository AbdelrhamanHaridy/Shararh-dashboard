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

export type CouponDiscountType = 'percentage' | 'fixed';
export type CouponTargetType = 'all' | 'specific_plans' | 'specific_users';
export type CouponStatus = 'active' | 'inactive';

export interface CouponPayload {
  code: string;
  title: string;
  description: string;
  discount_type: CouponDiscountType;
  discount_value: number;
  max_discount_amount: number | null;
  usage_limit: number;
  target_type: CouponTargetType;
  starts_at: string;
  expires_at: string;
  status: CouponStatus;
  plan_ids: number[];
  user_ids: number[];
}

export interface CouponResponse {
  success: boolean;
  status: number;
  message: string;
  data: any;
}

export interface SelectOption {
  label: string;
  value: number;
}

export interface CouponCreator {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
}

export interface CouponAnalytics {
  usage_count: number;
  total_discount_given: number;
  latest_usage_at: string | null;
  conversion_rate: number;
}

export interface CouponPlanRef {
  id: number;
  name: string;
}

export interface CouponUserRef {
  id: number;
  full_name?: string;
  name?: string;
}

export interface CouponDetail {
  id: number;
  code: string;
  title: string;
  description: string;
  discount_type: 'percentage' | 'fixed';
  discount_type_label: string;
  discount_value: number;
  max_discount_amount: number | null;
  usage_limit: number;
  used_count: number;
  target_type: string;
  target_type_label: string;
  starts_at: string;
  expires_at: string;
  status: string;
  status_label: string;
  is_date_expired: boolean;
  is_effectively_active: boolean;
  created_by: number;
  creator: CouponCreator;
  applicable_plans: CouponPlanRef[];
  target_users: CouponUserRef[];
  created_at: string;
  updated_at: string;
  analytics: CouponAnalytics;
}

export interface CouponDetailResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    coupon: CouponDetail;
  };
}
