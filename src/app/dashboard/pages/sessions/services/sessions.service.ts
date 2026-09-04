import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminSessionsQueryParams, AdminSessionsResponse } from '../models/session.model';
import { SessionDetailsResponse } from '../models/session-details.model';
import {
  ArchiveSessionResponse,
  EndSessionResponse,
  ReviewSessionPayload,
  ReviewSessionResponse,
} from '../models/session-actions.model';
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

  getAdminSessionDetails(id: number | string): Observable<SessionDetailsResponse> {
    return this.http.get<SessionDetailsResponse>(`${this.baseUrl}/${id}`);
  }

  endSession(id: number | string): Observable<EndSessionResponse> {
    return this.http.post<EndSessionResponse>(`${this.baseUrl}/${id}/end`, {});
  }

  reviewSession(
    id: number | string,
    payload: ReviewSessionPayload,
  ): Observable<ReviewSessionResponse> {
    return this.http.post<ReviewSessionResponse>(`${this.baseUrl}/${id}/review`, payload);
  }

  archiveSession(id: number | string): Observable<ArchiveSessionResponse> {
    return this.http.patch<ArchiveSessionResponse>(`${this.baseUrl}/${id}/archive`, {});
  }
}
