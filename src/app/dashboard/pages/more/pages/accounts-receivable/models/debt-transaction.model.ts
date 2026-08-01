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