// subscription-management/models/store-details.model.ts

export interface ShortcutAction {
  phone?: string;
  address?: string;
  city?: string;
  governorate?: string;
  lat?: number;
  long?: number;
  action_url: string;
}

export interface StoreShortcuts {
  call: ShortcutAction;
  whatsapp: ShortcutAction;
  location: ShortcutAction;
  plan: {
    plan_id: number;
    plan_name: string;
    status: string;
    status_label: string;
    days_left: number;
    ends_at: string;
  };
}

export interface StoreBranch {
  id: number;
  name: string;
  address: string;
  phone: string;
  shortcuts: Pick<StoreShortcuts, 'call' | 'whatsapp' | 'location'>;
}

export interface StoreTimelineEvent {
  id: number;
  type: string;
  title: string;
  description: string;
  created_at: string;
}

export interface StoreDetails {
  store: {
    id: number;
    name: string;
    code: string;
    phone: string;
    address: string;
    city: string;
    governorate: string;
  };
  is_active: boolean;
  owner: { id: number; name: string; phone: string; email: string } | null;
  assigned_employee: { id: number; name: string; phone: string } | null;
  subscription: {
    id: number;
    plan: {
      id: number;
      name: string;
      monthly_price: number;
      semi_annual_price: number;
      yearly_price: number;
    } | null;
    status: string;
    is_trial: boolean;
    starts_at: string;
    ends_at: string;
    days_left: number;
  } | null;
  shortcuts: StoreShortcuts;
  branches: StoreBranch[];
  timeline: StoreTimelineEvent[];
}

export interface StoreDetailsResponse {
  status: boolean;
  message: string;
  data: StoreDetails;
}
