export type CustomerRequestType = 'complaint' | 'suggestion';
export type CustomerRequestStatus = 'pending' | 'reviewing' | 'resolved' | 'cancelled';
export type CustomerRequestCategory =
  | 'debts'
  | 'wallets'
  | 'transactions'
  | 'shifts'
  | 'transfers'
  | 'day_closing'
  | 'other';
export type CustomerRequestSource =
  | 'whatsapp'
  | 'phone'
  | 'facebook'
  | 'app'
  | 'cashier'
  | 'collector'
  | 'admin'
  | 'other';
export type CustomerRequestDepartment =
  | 'general'
  | 'debts'
  | 'wallets'
  | 'cashier'
  | 'collector'
  | 'accounting'
  | 'support'
  | 'other';

export interface CustomerRequestPersonRef {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string | null;
  organization_code: string | null;
  phone: string | null;
  account_status: string | null;
  avatar_url: string | null;
  roles: string[];
}

export interface CustomerRequestBranchRef {
  id: number;
  name: string;
}

export interface CustomerRequest {
  id: number;
  request_number: string;
  customer_name: string;
  phone: string;
  type: CustomerRequestType;
  type_label: string;
  status: CustomerRequestStatus;
  status_label: string;
  category: CustomerRequestCategory;
  category_label: string;
  source: CustomerRequestSource;
  source_label: string;
  department: CustomerRequestDepartment;
  department_label: string;
  branch_id: number;
  assigned_user_id: number | null;
  details: string;
  admin_notes: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
  branch: CustomerRequestBranchRef;
  assigned_user: CustomerRequestPersonRef | null;
  creator: CustomerRequestPersonRef;
}

export interface CustomerRequestPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}

// ASSUMPTION: list response follows the same convention as your other list
// endpoints. Only the single-item wrapper was confirmed — verify this shape.
export interface CustomerRequestListResponse {
  success: boolean;
  status: number;
  message: string;
  data: CustomerRequest[];
  pagination?: CustomerRequestPagination;
}

export interface CustomerRequestDetailResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    customer_request: CustomerRequest;
  };
}

export interface CustomerRequestFilterParams {
  per_page?: number;
  page?: number;
  search?: string;
  type?: string;
  status?: string;
  category?: string;
  source?: string;
  department?: string;
  branch_id?: number;
  from_date?: string;
  to_date?: string;
}

export interface CustomerRequestPayload {
  customer_name: string;
  phone: string;
  type: CustomerRequestType;
  status: CustomerRequestStatus;
  category: CustomerRequestCategory;
  source: CustomerRequestSource;
  department: CustomerRequestDepartment;
  branch_id: number;
  assigned_user_id: number | null;
  details: string;
  admin_notes: string;
}
export interface CustomerRequestStats {
  total_requests: number;
  pending_requests: number;
  reviewing_requests: number;
  resolved_requests: number;
  complaints_count: number;
  suggestions_count: number;
}

export interface CustomerRequestStatsResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    stats: CustomerRequestStats;
  };
}

export interface CustomerRequestStatusPayload {
  status: CustomerRequestStatus;
  admin_notes: string;
}