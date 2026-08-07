export interface DashboardSummary {
  registered_clients: number;
  active_subscriptions: number;
  clients_in_progress: number;
  suggested_tasks: number;
}

export interface DashboardReferral {
  url: string;
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
  total_visits: number;
  new_registrations: number;
  employees: DashboardEmployeeVisit[];
}

export interface DashboardSubscriptionStat {
  count: number;
  percentage: number;
}

export interface DashboardCustomerStatistics {
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

export type DashboardExpiringSubscription = Record<string, any>;

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