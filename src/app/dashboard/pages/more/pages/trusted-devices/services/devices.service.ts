import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DeviceListApiResponse, DeviceFilters } from '../models/device.model';
import { environment } from '../../../../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DevicesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.baseAPIURL}/admin/devices`;

  getDevices(filters: DeviceFilters = {}): Observable<DeviceListApiResponse> {
    let params = new HttpParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const paramValue = typeof value === 'boolean' ? (value ? '1' : '0') : String(value);
        params = params.set(key, paramValue);
      }
    });

    return this.http.get<DeviceListApiResponse>(this.baseUrl, { params });
  }

  trustDevice(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/trust`, {});
  }

  untrustDevice(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/untrust`, {});
  }

  blockDevice(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/block`, {});
  }

  unblockDevice(id: number): Observable<any> {
    return this.http.post(`${this.baseUrl}/${id}/unblock`, {});
  }
}
