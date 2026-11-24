export interface SuggestedTask {
  id: number;
  title_ar: string;
  title_en: string;
  description_ar: string | null;
  description_en: string | null;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SuggestedTasksPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  has_more_pages: boolean;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  path: string;
  links: SuggestedTasksPaginationLink[];
}

export interface SuggestedTasksPaginationLink {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
}

export interface SuggestedTasksResponse {
  success: boolean;
  status: number;
  message: string;
  data: SuggestedTask[];
  pagination: SuggestedTasksPagination;
}
