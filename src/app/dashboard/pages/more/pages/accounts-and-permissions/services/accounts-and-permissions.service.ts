import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';
import {
  EmployeeListResponse,
  EmployeeDetailResponse,
  CreateEmployeePayload,
  CreateEmployeeResponse,
  PermissionsResponse,
  RolesResponse,
} from '../models/accounts-and-permissions-add-new-account.model';

export interface EmployeeFilterParams {
  page?: number;
  per_page?: number;
  search?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AccountsAndPermissionsService {
  private apiUrl = environment.baseAPIURL + '/admin/employees';

  constructor(private http: HttpClient) {}

  getEmployees(filters?: EmployeeFilterParams): Observable<EmployeeListResponse> {
    let params = new HttpParams();
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.per_page) params = params.set('per_page', filters.per_page.toString());
    if (filters?.search) params = params.set('search', filters.search);

    return this.http.get<EmployeeListResponse>(this.apiUrl, { params });
  }

  getEmployeeById(id: number): Observable<EmployeeDetailResponse> {
    return this.http.get<EmployeeDetailResponse>(`${this.apiUrl}/${id}`);
  }

  createEmployee(payload: CreateEmployeePayload): Observable<CreateEmployeeResponse> {
    return this.http.post<CreateEmployeeResponse>(this.apiUrl, payload);
  }

  deleteEmployee(id: number): Observable<{ success: boolean; status: number; message: string }> {
    return this.http.delete<{ success: boolean; status: number; message: string }>(
      `${this.apiUrl}/${id}`,
    );
  }

  getRoles(): Observable<RolesResponse> {
    return this.http.get<RolesResponse>(`${this.apiUrl}/roles`);
  }

  getPermissionsCatalog(): Observable<PermissionsResponse> {
    return this.http.get<PermissionsResponse>(`${this.apiUrl}/permissions`);
  }
}
