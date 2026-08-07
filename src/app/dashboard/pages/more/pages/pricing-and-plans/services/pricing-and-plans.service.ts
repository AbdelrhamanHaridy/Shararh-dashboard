import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PlanDetailResponse,
  PlanListResponse,
  PlanMutationResponse,
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

  // Note: response is nested as { data: { plan: Plan } }
  getPlanById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createPlan(payload: PlanPayload): Observable<PlanMutationResponse> {
    return this.http.post<PlanMutationResponse>(this.apiUrl, payload);
  }

  updatePlan(id: number, payload: PlanPayload): Observable<PlanMutationResponse> {
    return this.http.put<PlanMutationResponse>(`${this.apiUrl}/${id}`, payload);
  }

  deletePlan(id: number): Observable<{ success: boolean; status: number; message: string }> {
    return this.http.delete<{ success: boolean; status: number; message: string }>(
      `${this.apiUrl}/${id}`,
    );
  }
}
