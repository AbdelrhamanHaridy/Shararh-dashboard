export interface NotificationItem {
  id: string;
  category: string;
  severity: 'normal' | 'info' | 'warning' | string;
  icon: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  action_type: string;
  action_id: number | null;
  created_at: string;
}

export interface NotificationStatistics {
  alerts: number;
  notifications: number;
  unread: number;
}

export interface NotificationsPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}

export interface NotificationsResponse {
  success: boolean;
  message: string;
  statistics: NotificationStatistics;
  data: NotificationItem[];
  pagination: NotificationsPagination;
}


export interface NotificationDetailData {
  category: string;
  severity: string;
  icon: string;
  type: string;
  title: string;
  message: string;
  action_type: string;
  action_id: number | null;
}

export interface NotificationDetail {
  id: string;
  category: string;
  severity: string;
  icon: string;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  read_at: string | null;
  action_type: string;
  action_id: number | null;
  created_at: string;
  data: NotificationDetailData;
}

export interface NotificationDetailResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    notification: NotificationDetail;
  };
}