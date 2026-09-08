export interface AddMerchantPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  store_name: string;
  governorate: string;
  city: string;
  address: string;
  store_phone: string;
  lat: number | null;
  long: number | null;
  employees_count: number;
}

export interface AddMerchantResponse {
  success: boolean;
  status: number;
  message: string;
  data: AddMerchantResponseData;
}

export interface AddMerchantResponseData {
  user: OwnerResponseUser;
  store: OwnerResponseStore;
}

export interface OwnerResponseUser {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  organization_code: string;
  phone: string;
  account_status: string;
  avatar_url: string | null;
  interface_type: string;
  roles: string[];
}

export interface OwnerResponseStore {
  id: number;
  code: string | null;
  name: string;
  phone: string;
  governorate: string;
  city: string;
  address: string;
  employees_count: number;
  subscription_status: string;
  subscription_ends_at: string | null;
  cash_transfer_commission: number | null;
  cash_withdraw_commission: number | null;
  instapay_transfer_commission: number | null;
  instapay_withdraw_commission: number | null;
  bill_payment_commission: number | null;
}
