import { SessionUser } from './session.model';

export interface SessionStats {
  subscriptions_count: number;
  complaints_count: number;
  communications_count: number;
  total_points: number;
}

export interface SessionDetailsHeader {
  employee: SessionUser;
  shift_hours: string;
  start_time: string;
  end_time: string;
  session_duration: string;
  status: string;
  status_label: string;
  review_status: string;
  review_status_label: string;
  rating: string | null;
  rating_label: string | null;
  review_notes: string | null;
}

export interface SubscriptionReviewItem {
  id: number;
  customer_name: string;
  plan_type: string;
  plan_type_label: string;
  duration: string;
  amount: string;
  payment_method: string;
  payment_method_label: string;
  status: string;
  status_label: string;
}

export interface SubscriptionReview {
  monthly_count: number;
  semiannual_count: number;
  annual_count: number;
  total_count: number;
  items: SubscriptionReviewItem[];
}

export interface CommunicationReviewItem {
  id: number;
  customer_name: string;
  channel: string;
  channel_label: string;
  direction: string;
  direction_label: string;
  contact_type: string;
  contact_type_label: string;
  reason: string;
  time: string;
  time_ago: string;
}

export interface ComplaintItem {
  id: number;
  customer_name: string;
  subject: string;
  status: string;
  status_label: string;
  created_at: string;
}

export interface TaskItem {
  id: number;
  label: string;
  is_completed: boolean;
}

export interface TasksSummary {
  completed: number;
  total: number;
  items: TaskItem[];
}

export interface PointsBreakdownItem {
  id: number;
  label: string;
  points: number;
}

export interface SessionDetailsData {
  stats: SessionStats;
  header: SessionDetailsHeader;
  subscription_review: SubscriptionReview;
  communication_review: CommunicationReviewItem[];
  complaints: ComplaintItem[];
  tasks: TasksSummary;
  points_breakdown: PointsBreakdownItem[];
}

export interface SessionDetailsResponse {
  success: boolean;
  status: number;
  message: string;
  data: SessionDetailsData;
}
