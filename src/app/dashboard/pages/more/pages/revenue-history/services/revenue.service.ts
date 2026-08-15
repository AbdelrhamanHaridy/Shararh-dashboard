import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  RevenueFilters,
  RevenueListResponse,
  RevenueDashboardResponse,
} from '../models/revenue.model';
import { environment } from '../../../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RevenueService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.baseAPIURL}/admin/revenues`;

  getRevenues(filters?: RevenueFilters): Observable<RevenueListResponse> {
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, String(value));
        }
      });
    }

    return this.http.get<RevenueListResponse>(this.baseUrl, { params });
  }

  getDashboard(filters?: RevenueFilters): Observable<RevenueDashboardResponse> {
    let params = new HttpParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, String(value));
        }
      });
    }

    return this.http.get<RevenueDashboardResponse>(`${this.baseUrl}/dashboard`, { params });
  }
}
