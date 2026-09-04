export interface EndSessionResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    id: number;
    status: string;
    status_label: string;
    ended_at: string;
    duration: string;
    duration_minutes: number;
  };
}

export interface ReviewSessionPayload {
  rating?: 'excellent' | 'good' | 'acceptable' | 'poor';
  review_notes?: string;
  task_ids?: number[];
}

export interface ReviewSessionResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    id: number;
    review_status: string;
    review_status_label: string;
    rating: string;
    rating_label: string;
    review_notes: string | null;
  };
}

export interface ArchiveSessionResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    id: number;
    is_archived: boolean;
  };
}
