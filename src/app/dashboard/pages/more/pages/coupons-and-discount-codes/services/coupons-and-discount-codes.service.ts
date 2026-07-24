import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../environments/environment';
import { DashboardResponse } from '../../../../home/models/home.models';
import {
  CouponListResponse,
  Coupon,
  CouponStatsResponse,
} from '../models/coupons-and-discount-codes.model';

@Injectable({
  providedIn: 'root',
})
export class CouponsAndDiscountCodesService {
  private couponApiUrl = environment.baseAPIURL + '/admin/coupons';

  constructor(private http: HttpClient) {}

  /**
   * Get dashboard data
   */
  getDashboard(): Observable<DashboardResponse> {
    return this.http.get<DashboardResponse>(this.couponApiUrl);
  }

  /**
   * Get coupon statistics
   */
  getCouponStats(): Observable<CouponStatsResponse> {
    return this.http.get<CouponStatsResponse>(`${this.couponApiUrl}/stats`);
  }

  /**
   * Get list of coupons with optional pagination and filters
   */
  getCoupons(params?: CouponFilterParams): Observable<CouponListResponse> {
    let httpParams = new HttpParams();

    if (params) {
      // Pagination
      if (params.per_page) {
        httpParams = httpParams.set('per_page', params.per_page.toString());
      }

      // Filters
      if (params.search) {
        httpParams = httpParams.set('search', params.search);
      }
      if (params.status) {
        httpParams = httpParams.set('status', params.status);
      }
      if (params.target_type) {
        httpParams = httpParams.set('target_type', params.target_type);
      }
      if (params.created_by) {
        httpParams = httpParams.set('created_by', params.created_by.toString());
      }
      if (params.date_from) {
        httpParams = httpParams.set('date_from', params.date_from);
      }
      if (params.date_to) {
        httpParams = httpParams.set('date_to', params.date_to);
      }
      if (params.active_expired) {
        httpParams = httpParams.set('active_expired', params.active_expired);
      }

      // Sorting
      if (params.sort_by) {
        httpParams = httpParams.set('sort_by', params.sort_by);
      }
      if (params.sort_dir) {
        httpParams = httpParams.set('sort_dir', params.sort_dir);
      }
    }

    return this.http.get<CouponListResponse>(this.couponApiUrl, { params: httpParams });
  }

  /**
   * Get a single coupon by ID
   */
  getCouponById(
    id: number,
  ): Observable<{ success: boolean; status: number; message: string; data: Coupon }> {
    return this.http.get<{ success: boolean; status: number; message: string; data: Coupon }>(
      `${this.couponApiUrl}/${id}`,
    );
  }

  /**
   * Create a new coupon
   */
  createCoupon(
    couponData: any,
  ): Observable<{ success: boolean; status: number; message: string; data: Coupon }> {
    return this.http.post<{ success: boolean; status: number; message: string; data: Coupon }>(
      this.couponApiUrl,
      couponData,
    );
  }

  /**
   * Update an existing coupon
   */
  updateCoupon(
    id: number,
    couponData: any,
  ): Observable<{ success: boolean; status: number; message: string; data: Coupon }> {
    return this.http.put<{ success: boolean; status: number; message: string; data: Coupon }>(
      `${this.couponApiUrl}/${id}`,
      couponData,
    );
  }

  /**
   * Delete a coupon
   */
  deleteCoupon(id: number): Observable<{ success: boolean; status: number; message: string }> {
    return this.http.delete<{ success: boolean; status: number; message: string }>(
      `${this.couponApiUrl}/${id}`,
    );
  }

  /**
   * Toggle coupon status (activate/deactivate)
   */
  toggleCouponStatus(
    id: number,
    status: string,
  ): Observable<{ success: boolean; status: number; message: string; data: Coupon }> {
    return this.http.patch<{ success: boolean; status: number; message: string; data: Coupon }>(
      `${this.couponApiUrl}/${id}/status`,
      { status },
    );
  }
}

/**
 * Coupon filter parameters interface
 */
export interface CouponFilterParams {
  // Pagination
  per_page?: number;

  // Filters
  search?: string;
  status?: string;
  target_type?: string;
  created_by?: number;
  date_from?: string;
  date_to?: string;
  active_expired?: string;

  // Sorting
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
}
