import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  organization_code: string | null;
  phone: string;
  account_status: string;
  avatar_url: string | null;
  roles: string[]; // ['admin'] or ['user'] or ['admin', 'manager']
}

export interface LoginCredentials {
  login: string;
  password: string;
  fcm_token: string;
  device_uuid: string;
  device_name: string;
  platform: string;
  os_version: string;
  app_version: string;
}

export interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  role: string;
  store_name: string;
  governorate: string;
  city: string;
  address: string;
  store_phone: string;
  lat: number;
  long: number;
  employees_count: string;
  store_code: string;
}

export interface DeviceInfo {
  fcm_token: string;
  device_uuid: string;
  device_name: string;
  platform: string;
  os_version: string;
  app_version: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = environment.baseAPIURL;

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    // Check if user was previously logged in
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user_data');

    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.isLoggedInSubject.next(true);
        this.currentUserSubject.next(user);
      } catch (error) {
        this.clearAuthData();
      }
    }
  }

  /**
   * Login user
   */
  login(credentials: LoginCredentials): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        // Store auth data
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
        if (response.user) {
          localStorage.setItem('user_data', JSON.stringify(response.user));
          this.isLoggedInSubject.next(true);
          this.currentUserSubject.next(response.user);
        }
      }),
      catchError((error) => {
        console.error('Login failed:', error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Register new user
   */
  register(userData: RegisterData): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, userData).pipe(
      tap((response: any) => {
        // Store auth data
        if (response.token) {
          localStorage.setItem('auth_token', response.token);
        }
        if (response.user) {
          localStorage.setItem('user_data', JSON.stringify(response.user));
          this.isLoggedInSubject.next(true);
          this.currentUserSubject.next(response.user);
        }
      }),
      catchError((error) => {
        console.error('Registration failed:', error);
        return throwError(() => error);
      }),
    );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Clear auth data
   */
  private clearAuthData(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    this.isLoggedInSubject.next(false);
    this.currentUserSubject.next(null);
  }
}
