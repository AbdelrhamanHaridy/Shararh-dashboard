// ============================================
// Base Response
// ============================================

export interface DashboardResponse {
  success: boolean;
  status: number;
  message: string;
  data: DashboardData;
}

// ============================================
// Dashboard Data
// ============================================

export interface DashboardData {
  summary: Summary;
  employee_performance: EmployeePerformance;
  customer_statistics: CustomerStatistics;
  recent_notifications: Notification[];
  customer_requests: any[];
  updated_at: string;
}

// ============================================
// Summary
// ============================================

export interface Summary {
  total_subscriptions: number;
  active_subscriptions: number;
  expired_subscriptions: number;
  registered_customers: number;
}

// ============================================
// Employee Performance
// ============================================

export interface EmployeePerformance {
  active_employees: number;
  employees: Employee[];
}

export interface Employee {
  id: number;
  full_name: string;
  role: string;
  session_status: 'online' | 'offline' | 'busy' | 'away';
  today_points: number;
  session_start: string | null;
  session_end: string | null;
}

// ============================================
// Customer Statistics
// ============================================

export interface CustomerStatistics {
  subscription_status: SubscriptionStatus;
  customer_status: CustomerStatus;
}

export interface SubscriptionStatus {
  active: StatusCount;
  expired: StatusCount;
  trial: StatusCount;
}

export interface CustomerStatus {
  registered_only: StatusCount;
  subscribed: StatusCount;
  expired_subscription: StatusCount;
}

export interface StatusCount {
  count: number;
  percentage: number;
}

// ============================================
// Notifications
// ============================================

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  action_text: string | null;
  action_url: string | null;
  created_at: string;
  is_read: boolean;
}