import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  CommunicationsResponse,
  CommunicationOptionsResponse,
  CommunicationReasonContext,
  CommunicationReasonsResponse,
  SuggestedTasksResponse,
  CreateCommunicationPayload,
} from '../models/communications.model';

@Injectable({
  providedIn: 'root',
})
export class ContactLogService {
  private apiUrl = environment.baseAPIURL + '/admin/lead-communications';
  private readonly arabicHeaders = new HttpHeaders({ 'Accept-Language': 'ar' });

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
    return this.http.get<CommunicationsResponse>(this.apiUrl, {
      params,
      headers: this.arabicHeaders,
    });
  }

  getOptions(): Observable<CommunicationOptionsResponse> {
    return this.http.get<CommunicationOptionsResponse>(`${this.apiUrl}/options`, {
      headers: this.arabicHeaders,
    });
  }

  getCommunicationReasons(
    type: string,
    context: CommunicationReasonContext,
  ): Observable<CommunicationReasonsResponse> {
    let params = new HttpParams().set('type', type);
    if (context.kind === 'lead') {
      params = params.set('lead_id', context.leadId.toString());
    } else {
      params = params.set('customer_type', context.customerType);
    }

    return this.http.get<CommunicationReasonsResponse>(`${this.apiUrl}/reasons`, {
      params,
      headers: this.arabicHeaders,
    });
  }

  getSuggestedTasks(): Observable<SuggestedTasksResponse> {
    return this.http.get<SuggestedTasksResponse>(`${this.apiUrl}/suggested-tasks`, {
      headers: this.arabicHeaders,
    });
  }

  addCommunication(payload: CreateCommunicationPayload): Observable<any> {
    return this.http.post(this.apiUrl, payload, { headers: this.arabicHeaders });
  }

  getUsers(): Observable<any> {
    return this.http.get(`${environment.baseAPIURL}/admin/users`);
  }
}
