export interface RevenueStore {
  id: number;
  name: string;
}

export interface RevenueOwner {
  id: number;
  name: string;
}

export interface RevenueSubscription {
  plan: string;
  duration: string;
  starts_at: string | null;
  ends_at: string | null;
}

export interface RevenuePayment {
  amount: number;
  currency: string;
  status: string;
  status_label: string;
  submitted_at: string;
  reviewed_at: string | null;
  payment_method: string;
  coupon: string | null;
  discount_amount: number;
}

export interface RevenueTransaction {
  id: number;
  store: RevenueStore;
  owner: RevenueOwner;
  subscription: RevenueSubscription;
  payment: RevenuePayment;
}

export interface RevenuePagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}

export interface RevenueListResponse {
  success: boolean;
  status: number;
  message: string;
  data: RevenueTransaction[];
  pagination: RevenuePagination;
}

export interface RevenueFilters {
  search?: string;
  payment_status?: string;
  payment_method_id?: number;
  plan_id?: number;
  date_from?: string;
  date_to?: string;
  status?: string;
  per_page?: number;
  page?: number;
}

// Shape the shared-table component actually consumes
export interface RevenueTableRow {
  id: number;
  branchName: string;
  startTime: string;
  startDate: string;
  endTime: string;
  endDate: string;
  paymentMethod: string;
  discountCoupon: string;
  amount: number;
  processStatus: string;
}

// Dashboard statistics
export interface RevenueStatistics {
  total_revenue: number;
  today_revenue: number;
  active_subscriptions: number;
  expired_subscriptions: number;
}

export interface RevenueDashboardResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    statistics: RevenueStatistics;
  };
}
