import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';

export interface CurrentSessionResponse {
  success: boolean;
  status: number;
  message: string;
  errors: null | Record<string, any>;
  data?: {
    id: number;
    employee_id: number;
    start_time: string;
    end_time?: string;
    [key: string]: any;
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
}
