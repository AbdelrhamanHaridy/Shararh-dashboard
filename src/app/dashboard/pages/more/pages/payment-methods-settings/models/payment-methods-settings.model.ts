export interface PaymentMethodConfig {
  key: string;
  label: string;
  value: string | number | null;
}

export interface PaymentMethodApiResponse {
  id: number;
  name: string;
  type: string;
  type_label: string;
  is_active: boolean;
  has_fees: boolean;
  fees_percentage: number | null;
  processing_time: string | null;
  sort_order: number;
  icon: string | null;
  description: string;
  config: Record<string, unknown>;
  configs: PaymentMethodConfig[];
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface PaymentMethodsApiListResponse {
  success: boolean;
  status: number;
  message: string;
  data: {
    payment_methods: PaymentMethodApiResponse[];
  };
}

export interface PaymentMethod {
  id: number;
  type: string;
  name: string;
  time: string;
  data?: Array<{ name: string; value: string | number }>;
  isActive?: boolean;
  hasFees?: boolean;
  feesPercentage?: number | null;
  apiData?: PaymentMethodApiResponse;
}

export interface PaymentMethodUpdatePayload {
  name: string;
  type: string;
  is_active: number | boolean;
  has_fees: number | boolean;
  fees_percentage: number | null;
  sort_order: number;
  icon: string | null;
  description: string;
  config: Record<string, unknown>;
}
