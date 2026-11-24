import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { UserAppType, UserListResponse } from '../models/user-database.model';

@Injectable({
  providedIn: 'root',
})
export class UserDatabaseService {
  private http = inject(HttpClient);
  private apiUrl = environment.baseAPIURL;

  getUserStatistics(): Observable<any> {
    return this.http.get<UserListResponse>(`${this.apiUrl}/admin/users`);
  }

  getUsers(
    page: number = 1,
    perPage: number = 10,
    search?: string,
    type?: UserAppType,
  ): Observable<UserListResponse> {
    let params = new HttpParams().set('page', page.toString()).set('per_page', perPage.toString());

    if (search) {
      params = params.set('search', search);
    }

    if (type) {
      params = params.set('type', type);
    }

    return this.http.get<UserListResponse>(`${this.apiUrl}/admin/users`, { params });
  }

  getArchivedUsers(): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(`${this.apiUrl}/admin/users/archived`);
  }

  // Send notification
  sendNotification(userId: number, title: string, body: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/users/${userId}/send-notification`, {
      title,
      body,
    });
  }

  // Reset password (optional password)
  resetPassword(userId: number, password?: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/admin/users/${userId}/reset-password`,
      password ? { password } : {},
    );
  }

  // Activate / Suspend account
  updateAccountStatus(userId: number, accountStatus: 'active' | 'suspended'): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/users/${userId}/account-status`, {
      account_status: accountStatus,
      id: userId,
    });
  }

  // Force logout from all devices
  logoutDevices(userId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/users/${userId}/logout-devices`, {});
  }

  // Archive user
  archiveUser(userId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/users/${userId}/archive`, {});
  }

  createNewUser(payload: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/users`, payload);
  }
}
