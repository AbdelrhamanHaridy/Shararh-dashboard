import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';
import { DebtTransactionPayload, DebtTransactionResponse } from '../models/debt-transaction.model';

@Injectable({
  providedIn: 'root',
})
export class DebtTransactionsService {
  private baseUrl = environment.baseAPIURL + '/admin/debt-transactions';

  constructor(private http: HttpClient) {}

  /**
   * Get all debt transactions with users
   */
  getDebtTransactions(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}`);
  }

  addTransaction(payload: DebtTransactionPayload): Observable<DebtTransactionResponse> {
    return this.http.post<DebtTransactionResponse>(`${this.baseUrl}/add`, payload);
  }

  payTransaction(payload: DebtTransactionPayload): Observable<DebtTransactionResponse> {
    return this.http.post<DebtTransactionResponse>(`${this.baseUrl}/payment`, payload);
  }
}
