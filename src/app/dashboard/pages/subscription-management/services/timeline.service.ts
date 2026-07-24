import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

export interface TimelineEventResponse {
  id: number;
  subscription_id: number;
  store_id: number;
  type: string;
  title: string;
  description: string;
  performed_by: {
    id: number;
    name: string;
  };
  metadata: Record<string, any> | null;
  icon: string;
  color: string;
  created_at: string;
}

export interface TimelineApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: TimelineEventResponse[];
}

@Injectable({
  providedIn: 'root',
})
export class TimelineService {
  private http = inject(HttpClient);
  private apiUrl = environment.baseAPIURL;

  /**
   * Get timeline events for a store
   */
  getStoreTimeline(storeId: number): Observable<TimelineApiResponse> {
    return this.http.get<TimelineApiResponse>(
      `${this.apiUrl}/admin/subscription/timeline/store/${storeId}`,
    );
  }
}
