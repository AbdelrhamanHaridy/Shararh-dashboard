import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
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
