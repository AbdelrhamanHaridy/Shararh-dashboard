export interface StoreListResponse {
  success: boolean;
  status: number;
  message: any;
  data: Store[];
  pagination?: Pagination;
}

export interface Store {
  store_id: number;
  store_name: string;
  country: any;
  city: string;
  owner_name: string;
  admin_app: AppInfo;
  employee_app: AppInfo;
}

export interface AppInfo {
  latest_version: string;
  devices_count: number;
  status: any;
  installed_versions: any[];
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
