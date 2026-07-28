import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { SubscriptionStoresResponse, Store } from '../models/subscription-stores.model';
// import { StatisticsApiResponse } from '../models/subscription-stats.model';
import { environment } from '../../../../../environments/environment';
import { PermissionsResponse } from '../models/permissions.model';

@Injectable({
  providedIn: 'root',
})
export class PermissionsService {
  private http = inject(HttpClient);
  private apiUrl = environment.baseAPIURL;

  getPermissions(): Observable<PermissionsResponse> {
    return this.http.get<PermissionsResponse>(`${this.apiUrl}/admin/users/permissions`);
  }
}
