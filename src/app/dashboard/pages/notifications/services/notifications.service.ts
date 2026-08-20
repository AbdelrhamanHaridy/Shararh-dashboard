import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotificationDetailResponse, NotificationsResponse } from '../models/notification.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private apiUrl = environment.baseAPIURL + '/admin/notifications';

  constructor(private http: HttpClient) {}

  getNotifications(filters?: Record<string, any>): Observable<NotificationsResponse> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get<NotificationsResponse>(this.apiUrl, { params });
  }
  getNotificationDetail(id: string): Observable<NotificationDetailResponse> {
    return this.http.get<NotificationDetailResponse>(`${this.apiUrl}/${id}`);
  }

  markAsRead(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/${id}/read`, {});
  }
}
