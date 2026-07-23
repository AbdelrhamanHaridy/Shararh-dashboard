import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardResponse } from '../models/home.models';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private apiUrl = environment.baseAPIURL + '/admin/dashboard';

  constructor(private http: HttpClient) {}

  // Get admin dashboard data
  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(this.apiUrl);
  }

  /**
   * Get dashboard with date filter (if needed)
   */
  //   getDashboardWithFilters(params?: any): Observable<DashboardResponse> {
  //     return this.http.get<DashboardResponse>(this.apiUrl, { params });
  //   }
}
