export type FaqTargetType = 'all' | 'general' | 'owner' | 'cashier' | 'collector';

export interface FaqCreator {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string | null;
  organization_code: string | null;
  phone: string | null;
  account_status: string | null;
  avatar_url: string | null;
  roles: string[];
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  target_type: FaqTargetType;
  target_type_label: string;
  tags: string[];
  attachments: any[];
  image_urls: string[];
  youtube_links: string[];
  is_pinned: boolean;
  pin_order: number | null;
  views_count: number;
  is_active: boolean;
  created_by: number;
  creator: FaqCreator;
  created_at: string;
  updated_at: string;
}

export interface FaqMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface FaqFilterParams {
  per_page?: number;
  page?: number;
  search?: string;
  target_type?: string;
  is_pinned?: boolean;
  is_active?: boolean;
}

export interface FaqResponse {
  success: boolean;
  status: number;
  message: string;
  data: Faq[];
  meta?: FaqMeta;
}

export interface FaqSingleResponse {
  success: boolean;
  status: number;
  message: string;
  data: Faq;
}


// export interface Root {
//   success: boolean
//   status: number
//   message: string
//   data: Data
// }

// export interface Data {
//   faq: Faq
// }

// export interface Faq {
//   id: number
//   question: string
//   answer: string
//   target_type: string
//   target_type_label: string
//   tags: string[]
//   attachments: any[]
//   image_urls: any[]
//   youtube_links: any[]
//   is_pinned: boolean
//   pin_order: any
//   views_count: number
//   is_active: boolean
//   created_by: number
//   creator: Creator
//   created_at: string
//   updated_at: string
// }

// export interface Creator {
//   id: number
//   first_name: string
//   last_name: string
//   full_name: string
//   email: any
//   organization_code: any
//   phone: any
//   account_status: any
//   avatar_url: any
//   roles: string[]
// }


