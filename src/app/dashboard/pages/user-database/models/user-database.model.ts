export interface UserListResponse {
  success: boolean;
  status: number;
  message: string;
  data: User[];
  pagination: Pagination;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  account_status: string;
  roles: string[];
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
