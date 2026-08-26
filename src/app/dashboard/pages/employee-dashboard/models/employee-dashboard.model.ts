export interface DashboardSummary {
  registered_clients: number;
  active_subscriptions: number;
  clients_in_progress: number;
  completed_tasks_count: number;
  total_tasks_count: number;
  suggested_tasks: number;
  suggested_tasks_formatted: string;
}

export interface DashboardReferral {
  url: string;
  full_url: string;
  username: string;
  registered_from_link: number;
}

export interface DashboardEmployeeVisit {
  id: number;
  name: string;
  role: string;
  today_points: number;
  today_visits: number;
  status: string;
}

export interface DashboardVisitsStatistics {
  total_visits_today: number;
  total_visits_month: number;
  new_registrations_today: number;
  new_registrations_month: number;
  total_visits: number;
  new_registrations: number;
  employees: DashboardEmployeeVisit[];
}

export interface DashboardSubscriptionStat {
  count: number;
  percentage: number;
}

export interface DashboardCustomerStatistics {
  my_subscribed_clients: {
    active: DashboardSubscriptionStat;
    expired: DashboardSubscriptionStat;
    trial: DashboardSubscriptionStat;
  };
  my_registered_clients: {
    registered_only: DashboardSubscriptionStat;
    subscribed: DashboardSubscriptionStat;
    unsubscribed: DashboardSubscriptionStat;
  };
  subscriptions: {
    registered_only: DashboardSubscriptionStat;
    trial: DashboardSubscriptionStat;
    active: DashboardSubscriptionStat;
    expired: DashboardSubscriptionStat;
  };
}

export interface DashboardCoupon {
  code: string;
  status: string;
  target: string;
  usage_count: number;
  max_usage: number | null;
}

export interface DashboardExpiringSubscription {
  id: number;
  store_id: number;
  store_name: string;
  expires_at: string;
  expires_at_formatted: string;
  status: string;
  status_label: string;
}

export interface EmployeeDashboardData {
  summary: DashboardSummary;
  referral: DashboardReferral;
  visits_statistics: DashboardVisitsStatistics;
  expiring_subscriptions: DashboardExpiringSubscription[];
  customer_statistics: DashboardCustomerStatistics;
  my_coupons: DashboardCoupon[];
  updated_at: string;
}

export interface EmployeeDashboardResponse {
  success: boolean;
  status: number;
  message: string;
  data: EmployeeDashboardData;
}
