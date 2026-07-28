import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
// import { SubscriptionStoresResponse, Store } from '../models/subscription-stores.model';
// import { StatisticsApiResponse } from '../models/subscription-stats.model';
import { environment } from '../../../../../environments/environment';
import { UserListResponse } from '../models/user-database.model';
import { AddMerchantPayload, AddMerchantResponse } from '../models/add-merchant.model';

@Injectable({
  providedIn: 'root',
})
export class OwnerService {
  private apiUrl = environment.baseAPIURL + '/admin/owners';

  constructor(private http: HttpClient) {}

  createOwner(payload: AddMerchantPayload): Observable<AddMerchantResponse> {
    return this.http.post<AddMerchantResponse>(this.apiUrl, payload);
  }
}
