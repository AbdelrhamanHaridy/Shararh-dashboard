import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

export interface PointRule {
  id: number;
  code: string;
  name_ar: string;
  name_en: string;
  points: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EarnedPoint {
  id: number;
  crm_session_id: number;
  user_id: number;
  point_rule_id: number;
  points: number;
  reference_type: string;
  reference_id: number;
  notes: string | null;
  created_at: string;
  rule: PointRule;
}

export interface SessionData {
  id: number;
  user_id: number;
  type: string;
  started_at: string;
  ended_at: string | null;
  status: 'active' | 'ended';
  review_status: string;
  rating: number | null;
  review_notes: string | null;
  total_points: number;
  communications_count: number;
  complaints_count: number;
  subscriptions_count: number;
  duration_minutes: number | null;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

export interface SessionStats {
  total_points: number;
  communications_count: number;
  complaints_count: number;
  subscriptions_count: number;
}

export interface CompletedTasks {
  completed: number;
  total: number;
}

export interface CurrentSessionResponse {
  success: boolean;
  status: number;
  message: string;
  data?: {
    session: SessionData;
    stats: SessionStats;
    completed_tasks: CompletedTasks;
    earned_points: EarnedPoint[];
  };
}

export interface StartSessionRequest {
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private http = inject(HttpClient);
  private apiUrl = environment.baseAPIURL;

  /**
   * Check if there's a current active session
   */
  getCurrentSession(): Observable<CurrentSessionResponse> {
    return this.http
      .get<CurrentSessionResponse>(`${this.apiUrl}/admin/employee-sessions/current`)
      .pipe(
        catchError((error) => {
          console.error('Failed to fetch current session:', error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Start a new employee session
   */
  startSession(password: string): Observable<any> {
    const payload: StartSessionRequest = { password };
    return this.http.post(`${this.apiUrl}/admin/employee-sessions/start`, payload).pipe(
      tap((response: any) => {
        console.log('Session started successfully:', response);
      }),
      catchError((error) => {
        console.error('Failed to start session:', error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * End an active employee session
   */
  endSession(sessionId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/employee-sessions/${sessionId}/end`, {}).pipe(
      tap((response: any) => {
        console.log('Session ended successfully:', response);
      }),
      catchError((error) => {
        console.error('Failed to end session:', error);
        return throwError(() => error);
      }),
    );
  }
}
