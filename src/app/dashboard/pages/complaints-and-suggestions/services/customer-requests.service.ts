import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  CustomerRequestDetailResponse,
  CustomerRequestFilterParams,
  CustomerRequestListResponse,
  CustomerRequestPayload,
  CustomerRequestStatsResponse,
  CustomerRequestStatusPayload,
} from '../models/customer-request.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerRequestsService {
  private apiUrl = environment.baseAPIURL + '/admin/customer-requests';

  constructor(private http: HttpClient) {}

  getCustomerRequests(
    filters?: CustomerRequestFilterParams,
  ): Observable<CustomerRequestListResponse> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get<CustomerRequestListResponse>(this.apiUrl, { params });
  }

  createCustomerRequest(
    payload: CustomerRequestPayload,
  ): Observable<CustomerRequestDetailResponse> {
    return this.http.post<CustomerRequestDetailResponse>(this.apiUrl, payload);
  }

  // ASSUMPTION: no PUT endpoint was confirmed — following the same REST
  // pattern as every other module here. Verify this exists before shipping.
  updateCustomerRequest(
    id: number,
    payload: CustomerRequestPayload,
  ): Observable<CustomerRequestDetailResponse> {
    return this.http.put<CustomerRequestDetailResponse>(`${this.apiUrl}/${id}`, payload);
  }

  deleteCustomerRequest(
    id: number,
  ): Observable<{ success: boolean; status: number; message: string }> {
    return this.http.delete<{ success: boolean; status: number; message: string }>(
      `${this.apiUrl}/${id}`,
    );
  }

  private statsApiUrl = environment.baseAPIURL + '/admin/customer-requests/stats';

  getStats(filters?: CustomerRequestFilterParams): Observable<CustomerRequestStatsResponse> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get<CustomerRequestStatsResponse>(this.statsApiUrl, { params });
  }

  updateStatus(
    id: number,
    payload: CustomerRequestStatusPayload,
  ): Observable<CustomerRequestDetailResponse> {
    return this.http.patch<CustomerRequestDetailResponse>(`${this.apiUrl}/${id}/status`, payload);
  }
}
