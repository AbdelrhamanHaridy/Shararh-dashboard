import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';
import {
  DebtTransactionPayload,
  DebtTransactionResponse,
  GetTransactionDetailsResponse,
} from '../models/debt-transaction.model';

@Injectable({
  providedIn: 'root',
})
export class DebtTransactionsService {
  private baseUrl = environment.baseAPIURL + '/admin/debt-transactions';

  constructor(private http: HttpClient) {}

  /**
   * Get all debt transactions with users
   */
  getDebtTransactions(search = ''): Observable<any> {
    const params = new HttpParams().set('search', search);
    return this.http.get<any>(`${this.baseUrl}`, { params });
  }

  /**
   * Get transaction details for a specific user
   */
  getTransactionDetails(userId: number): Observable<GetTransactionDetailsResponse> {
    return this.http.get<GetTransactionDetailsResponse>(`${this.baseUrl}/${userId}`);
  }

  addTransaction(payload: DebtTransactionPayload): Observable<DebtTransactionResponse> {
    return this.http.post<DebtTransactionResponse>(`${this.baseUrl}/add`, payload);
  }

  payTransaction(payload: DebtTransactionPayload): Observable<DebtTransactionResponse> {
    return this.http.post<DebtTransactionResponse>(`${this.baseUrl}/payment`, payload);
  }
}
