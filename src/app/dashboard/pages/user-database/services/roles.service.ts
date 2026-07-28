import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { SubscriptionStoresResponse, Store } from '../models/subscription-stores.model';
// import { StatisticsApiResponse } from '../models/subscription-stats.model';
import { environment } from '../../../../../environments/environment';
import { UserListResponse } from '../models/user-database.model';
import { RolesListResponse } from '../models/roles.model';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private http = inject(HttpClient);
  private apiUrl = environment.baseAPIURL;

  getRoles(): Observable<RolesListResponse> {
    return this.http.get<RolesListResponse>(`${this.apiUrl}/admin/users/roles`);
  }
}
