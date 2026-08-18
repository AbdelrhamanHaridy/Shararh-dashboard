import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  CommunicationsResponse,
  CommunicationOptionsResponse,
  SuggestedTasksResponse,
  CreateCommunicationPayload,
} from '../models/communications.model';

@Injectable({
  providedIn: 'root',
})
export class ContactLogService {
  private apiUrl = environment.baseAPIURL + '/admin/lead-communications';

  constructor(private http: HttpClient) {}

  getCommunications(filters?: Record<string, any>): Observable<CommunicationsResponse> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get<CommunicationsResponse>(this.apiUrl, { params });
  }

  getOptions(): Observable<CommunicationOptionsResponse> {
    return this.http.get<CommunicationOptionsResponse>(`${this.apiUrl}/options`);
  }

  getSuggestedTasks(): Observable<SuggestedTasksResponse> {
    return this.http.get<SuggestedTasksResponse>(`${this.apiUrl}/suggested-tasks`);
  }

  addCommunication(payload: CreateCommunicationPayload): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }

  getUsers(): Observable<any> {
    return this.http.get(`${environment.baseAPIURL}/admin/users`);
  }
}
