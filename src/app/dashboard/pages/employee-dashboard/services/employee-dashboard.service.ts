import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EmployeeDashboardResponse } from '../models/employee-dashboard.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class EmployeeDashboardService {
  private apiUrl = environment.baseAPIURL + '/admin/employee/dashboard';

  constructor(private http: HttpClient) {}

  getDashboard(): Observable<EmployeeDashboardResponse> {
    return this.http.get<EmployeeDashboardResponse>(this.apiUrl);
  }
}
