export interface OwnerStore {
  id: number;
  name: string;
  phone: string;
  city: string | null;
  governorate: string | null;
  subscription: {
    plan_id: number | null;
    plan_name: string | null;
    status: string;
    is_trial: boolean;
  } | null;
}

export interface Owner {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string;
  stores_count: number;
  stores: OwnerStore[];
  created_at: string;
}

export interface OwnersQuery {
  search?: string;
  name?: string;
  phone?: string;
  page?: number;
  per_page?: number;
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  has_more_pages: boolean;
}

export interface OwnersResponse {
  success: boolean;
  status: number;
  message: string;
  data: Owner[];
  pagination: Pagination;
}

export interface AddSubscriberPayload {
  owner_id: number;
  store_id: number;
  plan_id: number;
  duration: 'monthly' | 'semi_annual' | 'yearly';
  payment_method_id: number;
}

export interface AddSubscriberResponse {
  success?: boolean;
  message?: string;
  data?: unknown;
}
