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

// ---------- App details popup + update campaigns ----------

export type AppApplication = 'admin' | 'employee';
export type UpdateCampaignType = 'notification' | 'force';

export interface AppDetailVersion {
  app_version_id: number;
  version: string;
  version_formatted: string;
  version_label: string; // e.g. "V2.1.0 (قديم)"
  status: string;
  status_label: string;
  devices_count: number;
  active_devices: number;
  is_latest: boolean;
  is_force_update: boolean;
  requires_update: boolean; // orange "مطلوب التحديث" badge
  can_notify: boolean; // green "تنبيه بالتحديث" button
  can_force_update: boolean; // red "تحديث اجباري" button
}

export interface AppDetailBranch {
  branch_id: number;
  branch_name: string;
  devices_count: number;
  active_devices: number;
  versions: { version: string; devices_count: number }[];
}

export interface AppDetailData {
  store_id: number;
  store_name: string;
  application: AppApplication;
  application_label: string;
  popup_title: string;
  latest_version: string | null;
  total_devices: number;
  active_devices: number;
  versions: AppDetailVersion[];
  branches: AppDetailBranch[];
}

export interface AppDetailResponse {
  success: boolean;
  status: number;
  message: string;
  data: AppDetailData;
}

export interface UpdateCampaignPayload {
  application: AppApplication;
  version_id: number; // app_version_id of the version card
  type: UpdateCampaignType;
  title: string;
  message: string;
}
export interface UpdateMessage {
  title: string;
  message: string;
}