import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
  getStores(page: number = 1): Observable<SubscriptionStoresResponse> {
    return this.http.get<SubscriptionStoresResponse>(`${this.apiUrl}/admin/subscription/stores`, {
      params: { page },
    });
  }
}
