import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  StoreSubscriptionStatus,
  SubscriptionStoresResponse,
} from '../models/subscription-stores.model';
import { StatisticsApiResponse } from '../models/subscription-stats.model';
import { environment } from '../../../../../environments/environment';
import { FollowUpEmployeesResponse } from '../../user-database/models/follow-up-employee.model';
import { StoreDetailsResponse } from '../../user-database/models/store-details.model';
import {
  AddSubscriberPayload,
  AddSubscriberResponse,
  OwnersQuery,
  OwnersResponse,
} from '../../user-database/models/subscription-owners.model';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionsService {
  private http = inject(HttpClient);
  private apiUrl = environment.baseAPIURL;

  /**
   * Get subscription statistics (KPI cards data)
   */
  getStatistics(): Observable<StatisticsApiResponse> {
    return this.http.get<StatisticsApiResponse>(`${this.apiUrl}/admin/subscription/statistics`);
  }

  /**
   * Get subscription stores (stores list)
   */
  // subscriptions.service.ts
  getStores(
    page: number = 1,
    search?: string,
    status: StoreSubscriptionStatus = 'all',
    followUpEmployeeId?: number | null,
  ): Observable<SubscriptionStoresResponse> {
    let params = new HttpParams().set('page', page.toString()).set('per_page', '15');
    const normalizedSearch = search?.trim();

    if (normalizedSearch) {
      params = params.set('search', normalizedSearch);
    }

    if (status !== 'all') {
      params = params.set('status', status);
    }

    if (followUpEmployeeId !== undefined && followUpEmployeeId !== null) {
      params = params.set('follow_up_employee_id', followUpEmployeeId.toString());
    }

    return this.http.get<SubscriptionStoresResponse>(`${this.apiUrl}/admin/subscription/stores`, {
      params,
    });
  }
  getStoreDetails(storeId: number): Observable<StoreDetailsResponse> {
    return this.http.get<StoreDetailsResponse>(
      `${this.apiUrl}/admin/subscription/stores/${storeId}`,
    );
  }
  getFollowUpEmployees(): Observable<FollowUpEmployeesResponse> {
    return this.http.get<FollowUpEmployeesResponse>(
      `${this.apiUrl}/admin/subscription/follow-up-employees`,
    );
  }
  getOwners(query: OwnersQuery = {}): Observable<OwnersResponse> {
    let params = new HttpParams();
    if (query.search) params = params.set('search', query.search);
    if (query.name) params = params.set('name', query.name);
    if (query.phone) params = params.set('phone', query.phone);
    if (query.page) params = params.set('page', query.page.toString());
    if (query.per_page) params = params.set('per_page', query.per_page.toString());

    return this.http.get<OwnersResponse>(`${this.apiUrl}/admin/subscription/owners`, { params });
  }

  addSubscriber(payload: AddSubscriberPayload): Observable<AddSubscriberResponse> {
    return this.http.post<AddSubscriberResponse>(
      `${this.apiUrl}/admin/subscription/add-subscriber`,
      payload,
    );
  }
}
