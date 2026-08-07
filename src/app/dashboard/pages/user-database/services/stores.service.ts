import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { StoreListResponse } from '../models/store.model';

@Injectable({
  providedIn: 'root',
})
export class StoresService {
  private apiUrl = environment.baseAPIURL + '/admin/stores';

  constructor(private http: HttpClient) {}

  getStores(organizationCode: string, perPage?: number): Observable<StoreListResponse> {
    let params = new HttpParams().set('organization_code', organizationCode);
    if (perPage) {
      params = params.set('per_page', perPage.toString());
    }
    return this.http.get<StoreListResponse>(this.apiUrl, { params });
  }
}
