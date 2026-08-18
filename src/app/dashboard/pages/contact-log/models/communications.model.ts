export interface CommunicationsResponse {
  success: boolean
  status: number
  message: string
  data: Communication[]
  pagination: Pagination
}

export interface Communication {
  id: number
  lead_id: number
  communication_type: string
  communication_type_label: string
  communication_channel: string
  communication_channel_label: string
  communication_reason: string
  communication_reason_label: string
  notes: string
  time_label: string
  next_follow_up_at?: string
  created_at: string
  updated_at: string
  lead: Lead
  employee: Employee
}

export interface Lead {
  id: number
  name: string
  phone: string
  activity_name: string
  status: string
  status_label: string
}

export interface Employee {
  id: number
  first_name: string
  last_name: string
  name: string
}

export interface Pagination {
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number
  to: number
  has_more_pages: boolean
}

// ----- Added for options / suggested-tasks / create -----

export interface OptionItem {
  key: string;
  value: string;
  label: string;
}

export interface CommunicationOptionsData {
  communication_types: OptionItem[];
  communication_channels: OptionItem[];
  communication_reasons: OptionItem[];
}

export interface CommunicationOptionsResponse {
  success: boolean;
  status: number;
  message: string;
  data: CommunicationOptionsData;
}

export interface SuggestedTaskItem {
  id: number;
  title: string;
  title_ar: string;
  title_en: string;
  description: string | null;
  category: string;
  is_active: boolean;
}

export interface SuggestedTasksData {
  total_tasks: number;
  completed_tasks: number;
  remaining_tasks: number;
  completion_percentage: number;
  tasks: SuggestedTaskItem[];
}

export interface SuggestedTasksResponse {
  success: boolean;
  status: number;
  message: string;
  data: SuggestedTasksData;
}

export interface CreateCommunicationPayload {
  communication_type: string;
  communication_channel: string;
  communication_reason: string;
  notes?: string;
  next_follow_up_at?: string;
  lead_id: number;
}