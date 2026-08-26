import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminSessionsQueryParams, AdminSessionsResponse } from '../models/session.model';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SessionsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.baseAPIURL}/admin/admin-sessions`;

  getAdminSessions(params: AdminSessionsQueryParams = {}): Observable<AdminSessionsResponse> {
    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        httpParams = httpParams.set(key, value);
      }
    });

    return this.http.get<AdminSessionsResponse>(this.baseUrl, { params: httpParams });
  }
}
