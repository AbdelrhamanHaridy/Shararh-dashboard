import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AccountsAndPermissionsService {
  private apiUrl = environment.baseAPIURL + '/admin/employees';

  constructor(private http: HttpClient) {}

  // Get all employees
  getEmployees(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  /**
   * Get dashboard with date filter (if needed)
   */
  //   getDashboardWithFilters(params?: any): Observable<DashboardResponse> {
  //     return this.http.get<DashboardResponse>(this.apiUrl, { params });
  //   }
}
