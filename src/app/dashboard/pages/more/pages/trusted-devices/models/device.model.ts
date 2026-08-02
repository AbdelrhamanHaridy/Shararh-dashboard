export interface DeviceApiResponse {
  id: number;
  device_uuid: string;
  device_name: string;
  platform: string;
  os_version: string;
  app_version: string;
  is_online: boolean;
  is_trusted: boolean;
  is_blocked: boolean;
  last_ip: string;
  last_latitude: number | null;
  last_longitude: number | null;
  last_location: string | null;
  last_seen_at: string;
  created_at: string;
}

export interface DeviceListApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: DeviceApiResponse[];
  pagination: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    has_more_pages: boolean;
  };
}

export interface Device {
  id: number;
  uuid: string;
  name: string;
  platform: string;
  browserLabel: string;
  isOnline: boolean;
  isTrusted: boolean;
  isBlocked: boolean;
  lastIp: string;
  location: string;
  lastSeenLabel: string;
  apiData: DeviceApiResponse;
}

export interface DeviceFilters {
  user_id?: number;
  is_online?: boolean;
  is_trusted?: boolean;
  is_blocked?: boolean;
  per_page?: number;
}
