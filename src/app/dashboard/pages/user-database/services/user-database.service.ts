import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { SubscriptionStoresResponse, Store } from '../models/subscription-stores.model';
// import { StatisticsApiResponse } from '../models/subscription-stats.model';
import { environment } from '../../../../../environments/environment';
import { UserListResponse } from '../models/user-database.model';

@Injectable({
  providedIn: 'root',
})
export class UserDatabaseService {
  private http = inject(HttpClient);
  private apiUrl = environment.baseAPIURL;

  /**
   * Get user database (KPI cards data)
   */
  getUserStatistics(): Observable<any> {
    return this.http.get<UserListResponse>(`${this.apiUrl}/admin/users`);
  }
  getUsers(): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(`${this.apiUrl}/admin/users`);
  }

  getArchivedUsers(): Observable<UserListResponse> {
    return this.http.get<UserListResponse>(`${this.apiUrl}/admin/users/archived`);
  }

  archiveUser(userId: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}/admin/users/${userId}/archive`, {});
  }

  /**
   * Get user database stores (stores list)
   */
  createNewUser(payload: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/admin/users`, payload);
  }
}
