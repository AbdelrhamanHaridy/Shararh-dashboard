export interface SessionUser {
  id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  avatar: string | null;
  job_title: string;
}

export interface ApiSession {
  id: number;
  user: SessionUser;
  type: string;
  type_label: string;
  started_at: string;
  ended_at: string | null;
  duration: string | null;
  duration_minutes: number | null;
  operations_count: number;
  status: string;
  status_label: string;
  rating: string | null;
  rating_label: string | null;
  review_status: string;
  review_status_label: string;
  total_points: number;
  is_archived: boolean;
  created_at: string;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface PaginatedSessions {
  current_page: number;
  data: ApiSession[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

export interface AdminSessionsData {
  total_points_today: number;
  communications_today: number;
  average_session_duration: string;
  sessions_today: number;
  data: PaginatedSessions;
}

export interface AdminSessionsResponse {
  success: boolean;
  status: number;
  message: string;
  data: AdminSessionsData;
}

export interface AdminSessionsQueryParams {
  page?: number;
  per_page?: number;
  date?: string;
  employee_id?: number;
  type?: string;
  status?: string;
}

// View-model shape consumed by the sessions table UI
export interface SessionRow {
  id: number;
  avatarUrl: string;
  employeeName: string;
  jobTitle: string;
  startTime: string;
  startDate: string;
  endTime: string;
  endDate: string;
  duration: string;
  status: string;
  rating: string;
  operations: number;
}