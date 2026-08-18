export interface LeadEmployee {
  id: number;
  first_name: string;
  last_name: string;
  name: string;
}

export interface Lead {
  id: number;
  name: string;
  activity_name: string;
  phone: string;
  city: string;
  governorate: string;
  street_name: string;
  notes: string;
  status: string;
  status_label: string;
  status_points: number;
  source: string;
  source_label: string;
  is_archived: boolean;
  last_contact_at: string | null;
  claimed_at: string | null;
  created_at: string;
  updated_at: string;
  notes_count: number;
  attachments_count: number;
  communications_count: number;
  next_follow_up_at: string | null;
  assigned_employee: LeadEmployee | null;
  creator: LeadEmployee | null;
  // latest_communication, latest_note, latest_status_history, all_notes,
  // status_history exist on the payload too but aren't used by the cards yet
}

export interface LeadsPagination {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  has_more_pages: boolean;
}

export interface LeadsResponse {
  success: boolean;
  status: number;
  message: string;
  data: Lead[];
  pagination: LeadsPagination;
}

export interface LeadStatistics {
  total_leads: number;
  available_leads: number;
  in_progress_leads: number;
  new_leads: number;
  contacted_leads: number;
  interested_leads: number;
  subscribed_leads: number;
  rejected_leads: number;
  today_leads: number;
  total_points: number;
  today_points: number;
}

export interface LeadStatsResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    statistics: LeadStatistics;
  };
}