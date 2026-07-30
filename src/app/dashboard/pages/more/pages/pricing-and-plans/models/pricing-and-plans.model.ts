export interface Plan {
  id: number;
  name: string;
  offices_limit: number | null;
  users_limit: number | null;
  wallets_limit: number | null;
  devices_limit: number | null;
  is_unlimited_wallets: boolean;
  is_unlimited_users: boolean;
  is_unlimited_offices: boolean;
  is_unlimited_devices: boolean;
  monthly_price: number;
  semi_annual_price: number;
  yearly_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlanPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}

export interface PlanListResponse {
  success: boolean;
  status: number;
  message: string;
  data: Plan[];
  pagination: PlanPagination;
}

export interface PlanDetailResponse {
  success: boolean;
  status: number;
  message: string;
  data: Plan;
}

// Matches the real POST/PUT payload shape — note booleans are sent as 0/1, not true/false
export interface PlanPayload {
  name: string;
  offices_limit: number | null;
  users_limit: number | null;
  wallets_limit: number | null;
  devices_limit: number | null;
  is_unlimited_wallets: 0 | 1;
  is_unlimited_users: 0 | 1;
  is_unlimited_offices: 0 | 1;
  is_unlimited_devices: 0 | 1;
  monthly_price: number;
  semi_annual_price: number;
  yearly_price: number;
  is_active: 0 | 1;
}

export interface PlanMutationResponse {
  success: boolean;
  status: number;
  message: string;
  data: Plan; // flat, for POST/PUT
}
