export interface PermissionsResponse {
  success: boolean;
  status: number;
  message: string;
  data: PermissionsData;
}

export interface PermissionsData {
  permissions: PermissionCategory[];
}

export interface PermissionCategory {
  label: string;
  permissions: Permission[];
}

export interface Permission {
  id: number;
  key: string;
  label: string;
}