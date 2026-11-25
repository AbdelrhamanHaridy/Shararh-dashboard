import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Employee {
  id: number;
  name: string;
  role: string;
  role_label: string;
  avatar: string | null;
  total_points: number;
  rank: number;
  is_top_performer: boolean;
  badge: string | null;
}

export interface ProgressBoardPeriod {
  month: number;
  year: number;
  formatted: string; // "2026-04"
  label: string; // "شهر أبريل 2026"
  month_name: string;
}

export interface AvailableMonth {
  month: number;
  year: number;
  value: string; // "2026-04"
  label: string;
  name: string;
  is_current: boolean;
  is_selected: boolean;
}

export interface ProgressBoardData {
  title: string;
  description: string;
  selected_month: number;
  selected_year: number;
  period_label: string;
  period: ProgressBoardPeriod;
  available_months: AvailableMonth[];
  total_employees: number;
  top_performers: Employee[];
  other_employees: Employee[];
  leaderboard: Employee[];
}

export interface ProgressBoardResponse {
  success: boolean;
  status: number;
  message: string;
  data: ProgressBoardData;
}

@Injectable({
  providedIn: 'root',
})
export class ProgressBoardService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.baseAPIURL;

  /**
   * @param period "YYYY-MM". When omitted, the backend uses the current month.
   */
  getProgressBoard(period?: string | null): Observable<ProgressBoardResponse> {
    let params = new HttpParams();
    if (period) {
      params = params.set('period', period);
    }
    return this.http.get<ProgressBoardResponse>(`${this.apiUrl}/admin/progress-board`, { params });
  }
}