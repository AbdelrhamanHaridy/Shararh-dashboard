export interface DebtTransactionPayload {
  user_id: number;
  amount: number;
  description: string;
}

export interface DebtTransactionResponse {
  success: boolean;
  status: number;
  message: string;
  data: any; // shape not provided — adjust once a sample response is available
}

export interface DebtTransactionUser {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  email: string;
  role: string;
  role_label: string;
  current_balance: number;
  total_added: number;
  total_payments: number;
  transaction_count: number;
  last_transaction_date: string | null;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  has_more_pages: boolean;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  path: string;
}

export interface GetDebtTransactionsResponse {
  success: boolean;
  status: number;
  message: string;
  data: DebtTransactionUser[];
  pagination: PaginationMeta;
}

export interface TransactionRecord {
  id: number;
  type: 'add' | 'payment';
  type_label: string;
  amount: number;
  description: string;
  created_at: string;
}

export interface Employee {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  email: string;
  role: string;
}

export interface TransactionDetailsData {
  employee: Employee;
  current_balance: number;
  total_added: number;
  total_payments: number;
  last_transaction_date: string | null;
  transaction_count: number;
  transactions: TransactionRecord[];
}

export interface GetTransactionDetailsResponse {
  success: boolean;
  status: number;
  message: string;
  data: TransactionDetailsData;
}
