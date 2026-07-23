export interface Owner {
  id: number;
  name: string;
  phone: string;
}

export interface Subscription {
  plan_name: string | null;
  status: string;
  is_trial: boolean;
  starts_at: string;
  ends_at: string;
  days_left: number;
}

export interface Store {
  id: number;
  name: string;
  phone: string;
  city: string;
  governorate: string;
  owner: Owner;
  subscription: Subscription | null;
  offices_count: number;
  employees_count: number;
  created_at: string;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}

export interface SubscriptionStoresResponse {
  success: boolean;
  status: number;
  message: string;
  data: Store[];
  pagination: Pagination;
}
