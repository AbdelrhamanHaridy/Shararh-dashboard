import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SubscriptionStoresResponse, Store } from '../models/subscription-stores.model';
import { StatisticsApiResponse } from '../models/subscription-stats.model';
import { environment } from '../../../../../environments/environment';

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
  getStores(page: number = 1, search?: string): Observable<SubscriptionStoresResponse> {
    let params = new HttpParams().set('page', page.toString());
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<SubscriptionStoresResponse>(`${this.apiUrl}/admin/subscription/stores`, {
      params,
    });
  }
}
