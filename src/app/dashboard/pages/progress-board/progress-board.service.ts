import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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

export interface ProgressBoardData {
  title: string;
  description: string;
  selected_month: number;
  selected_year: number;
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

  getProgressBoard(): Observable<ProgressBoardResponse> {
    return this.http.get<ProgressBoardResponse>(`${this.apiUrl}/admin/progress-board`);
  }
}
