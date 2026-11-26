// models/version-stores.model.ts
// Rebuilt from the API docs. If other files import extra fields from your old version of this
// file, merge them in instead of replacing blindly.

export interface StoreListMeta {
  last_updated_at: string; // ISO, e.g. "2026-11-12T09:40:00Z"
  last_updated_formatted: string; // "2026-11-12 11:40 AM"
  last_updated_human: string; // "منذ لحظات"
  refresh_interval_ms: number; // e.g. 30000
}

export interface InstalledVersion {
  version: string;
  devices_count: number;
  active_devices: number;
  is_latest: boolean;
}

export interface StoreAppInfo {
  latest_version: string | null;
  devices_count: number;
  active_devices: number;
  status: string | null; // "latest" | "outdated" | ...
  installed_versions: InstalledVersion[];
}

export interface StoreBranch {
  branch_id: number;
  branch_name: string;
  admin_app: StoreAppInfo;
  employee_app: StoreAppInfo;
}

export interface Store {
  store_id: number;
  store_name: string;
  code: string;
  phone: string;
  city: string | null;
  governorate: string | null;
  owner_name: string;
  admin_app: StoreAppInfo;
  employee_app: StoreAppInfo;
  branches: StoreBranch[];
}

export interface Pagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface StoreListResponse {
  success: boolean;
  status: number;
  message: string;
  meta: StoreListMeta;
  data: Store[];
  pagination: Pagination;
}

export interface GroupedAppVersion {
  version: string;
  users_count: number;
  devices_count: number;
  users_label: string;
  label: string;
}

export interface GroupedVersionsResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    admin_app_versions: GroupedAppVersion[];
    employee_app_versions: GroupedAppVersion[];
  };
}

export interface StoreVersionFilters {
  admin_versions: string[];
  employee_versions: string[];
  versions: string[];
}

export interface StoreListFilters extends Partial<StoreVersionFilters> {
  page: number;
  per_page: number;
  search?: string;
}