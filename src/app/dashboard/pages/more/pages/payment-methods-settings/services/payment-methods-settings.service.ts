import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  PaymentMethodsApiListResponse,
  PaymentMethodUpdatePayload,
} from '../models/payment-methods-settings.model';
import { environment } from '../../../../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentMethodsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.baseAPIURL + '/admin/payment-methods';

  getPaymentMethods(): Observable<PaymentMethodsApiListResponse> {
    return this.http.get<PaymentMethodsApiListResponse>(this.baseUrl);
  }

  updatePaymentMethod(id: number, payload: PaymentMethodUpdatePayload): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, payload);
  }

  togglePaymentMethod(id: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/toggle`, {});
  }

  deletePaymentMethod(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  createPaymentMethod(payload: PaymentMethodUpdatePayload): Observable<any> {
    return this.http.post(this.baseUrl, payload);
  }
}
