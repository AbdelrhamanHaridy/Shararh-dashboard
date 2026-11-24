export interface UserListResponse {
  success: boolean;
  status: number;
  message: string;
  data: User[];
  pagination: Pagination;
}

export type UserAppType = 'admin_app' | 'employee_app';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  account_status: string;
  roles: string[];
  devices_count: number;
  app_versions: string[];
  app_versions_formatted: string;

  activity_status: string;
  activity_status_label: string;
  is_online: boolean;
  last_activity: string;
  last_seen_at: string | null;
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
