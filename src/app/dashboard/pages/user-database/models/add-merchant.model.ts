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
  data: any;
}