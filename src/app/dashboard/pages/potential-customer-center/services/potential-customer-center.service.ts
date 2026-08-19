import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { LeadsResponse, LeadStatsResponse } from '../models/potential-customer-center.model';

@Injectable({
  providedIn: 'root',
})
export class PotentialCustomerCenterService {
  private apiUrl = environment.baseAPIURL + '/admin/leads';

  constructor(private http: HttpClient) {}
  getStats(): Observable<LeadStatsResponse> {
    return this.http.get<LeadStatsResponse>(`${this.apiUrl}/stats`);
  }

  getLeads(filters?: Record<string, any>): Observable<LeadsResponse> {
    let params = new HttpParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, value.toString());
        }
      });
    }
    return this.http.get<LeadsResponse>(this.apiUrl, { params });
  }

  changeLeadStatus(leadId: number, payload: { status: string; note?: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/${leadId}/change-status`, payload);
  }

  deleteLead(leadId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${leadId}`);
  }

  getSources(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sources`);
  }

  createLead(payload: {
    name: string;
    activity_name: string;
    phone: string;
    city: string;
    governorate: string;
    street_name: string;
    notes?: string;
    source: string;
    status: string;
    assigned_employee_id?: number;
    group_ids?: number[][];
  }): Observable<any> {
    return this.http.post(this.apiUrl, payload);
  }
  updateLead(
    leadId: number,
    payload: {
      name: string;
      activity_name: string;
      phone: string;
      city: string;
      governorate: string;
      street_name: string;
      notes?: string;
      source: string;
      assigned_employee_id?: number;
      group_ids?: number[][];
    },
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/${leadId}`, payload);
  }
}
