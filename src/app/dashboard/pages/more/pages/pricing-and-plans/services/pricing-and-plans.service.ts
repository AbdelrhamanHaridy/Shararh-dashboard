import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PlanDetailResponse,
  PlanListResponse,
  PlanPayload,
} from '../models/pricing-and-plans.model';
import { environment } from '../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PricingAndPlansService {
  private apiUrl = environment.baseAPIURL + '/admin/plans';

  constructor(private http: HttpClient) {}

  getPlans(): Observable<PlanListResponse> {
    return this.http.get<PlanListResponse>(this.apiUrl);
  }

  getPlanById(id: number): Observable<PlanDetailResponse> {
    return this.http.get<PlanDetailResponse>(`${this.apiUrl}/${id}`);
  }

  createPlan(payload: PlanPayload): Observable<PlanDetailResponse> {
    return this.http.post<PlanDetailResponse>(this.apiUrl, payload);
  }

  updatePlan(id: number, payload: PlanPayload): Observable<PlanDetailResponse> {
    return this.http.put<PlanDetailResponse>(`${this.apiUrl}/${id}`, payload);
  }

  deletePlan(id: number): Observable<{ success: boolean; status: number; message: string }> {
    return this.http.delete<{ success: boolean; status: number; message: string }>(
      `${this.apiUrl}/${id}`,
    );
  }
}
