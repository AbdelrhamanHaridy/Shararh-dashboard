// Reuse previous interfaces for Store, Owner, Subscription, Pagination

import { Store } from './subscription-stores.model';

export interface StoreStatistics {
  registered_stores: number;
  active_subscriptions: number;
  expired_subscriptions: number;
  suspended_stores: number;
  trial_subscriptions: number;
  pending_payments: number;
  monthly_revenue: number;
  total_renewals: number;
  total_revenue: number;
}

export interface StatisticsData {
  statistics: StoreStatistics;
}

// Union type for different response types
export type StoreApiResponseData = Store[] | StatisticsData;

export interface StatisticsApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: StatisticsData;
}

// Or a combined generic response
export interface GenericApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}
