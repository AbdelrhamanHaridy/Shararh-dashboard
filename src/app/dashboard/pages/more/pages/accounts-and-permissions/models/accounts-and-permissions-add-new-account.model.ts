export interface EmployeeCreator {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
}

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  role: string;
  role_label: string | null;
  permissions_mode: 'limited_access' | 'full_access' | string;
  permissions: string[];
  created_at: string;
}

export interface EmployeePagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}

export interface EmployeeListResponse {
  success: boolean;
  status: number;
  message: string;
  data: Employee[];
  pagination: EmployeePagination;
}

export interface EmployeeDetailResponse {
  success: boolean;
  status: number;
  message: string;
  data: Employee;
}

// ASSUMPTION: no POST payload example was provided — inferred from the
// shape of GET admin/employees. Verify against your backend before shipping.
export interface CreateEmployeePayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  permissions_mode: 'limited_access' | 'full_access';
  permissions: string[];
}

export interface CreateEmployeeResponse {
  success: boolean;
  status: number;
  message: string;
  data: Employee;
}

export interface PermissionItem {
  id: number;
  key: string;
  label: string;
}

export interface PermissionCategory {
  label: string;
  permissions: PermissionItem[];
}

export interface PermissionsResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    permissions: PermissionCategory[];
  };
}

export interface EmployeeRole {
  name: string;
  label: string;
  permissions: string[]; // permission keys, e.g. "session.start"
}

export interface RolesResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    roles: EmployeeRole[];
  };
}