import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  FaqFilterParams,
  FaqResponse,
  FaqSingleResponse,
  Faq,
} from '../models/frequently-asked-questions.model';

@Injectable({
  providedIn: 'root',
})
export class FrequentlyAskedQuestionsService {
  private faqApiUrl = environment.baseAPIURL + '/admin/faqs';

  constructor(private http: HttpClient) {}

  /**
   * Get dashboard with date filter (if needed)
   */
  // getDashboardWithFilters(params?: any): Observable<DashboardResponse> {
  //   return this.http.get<DashboardResponse>(this.apiUrl, { params });
  // }

  // ==================== FAQs ====================

  /**
   * Get list of FAQs with optional filters
   * GET: admin/faqs
   */
  getFaqs(filters?: FaqFilterParams): Observable<FaqResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.per_page) {
        params = params.set('per_page', filters.per_page.toString());
      }
      if (filters.page) {
        params = params.set('page', filters.page.toString());
      }
      if (filters.search) {
        params = params.set('search', filters.search);
      }
      if (filters.target_type) {
        params = params.set('target_type', filters.target_type);
      }
      if (filters.is_pinned !== undefined && filters.is_pinned !== null) {
        params = params.set('is_pinned', filters.is_pinned.toString());
      }
      if (filters.is_active !== undefined && filters.is_active !== null) {
        params = params.set('is_active', filters.is_active.toString());
      }
    }

    return this.http.get<FaqResponse>(this.faqApiUrl, { params });
  }

  /**
   * Get a single FAQ by ID
   * GET: admin/faqs/{id}
   */
  getFaqById(id: number): Observable<any> {
    return this.http.get<any>(`${this.faqApiUrl}/${id}`);
  }

  /**
   * Create a new FAQ
   * POST: admin/faqs
   */
  createFaq(faqData: any): Observable<FaqSingleResponse> {
    return this.http.post<FaqSingleResponse>(this.faqApiUrl, faqData);
  }

  /**
   * Update an existing FAQ Partial<Faq>)
   * PUT: admin/faqs/{id}
   */
  updateFaq(id: number, faqData: any): Observable<FaqSingleResponse> {
    return this.http.put<FaqSingleResponse>(`${this.faqApiUrl}/${id}`, faqData);
  }

  /**
   * Delete a FAQ
   * DELETE: admin/faqs/{id}
   */
  deleteFaq(id: number): Observable<{ success: boolean; status: number; message: string }> {
    return this.http.delete<{ success: boolean; status: number; message: string }>(
      `${this.faqApiUrl}/${id}`,
    );
  }

  /**
   * Pin a FAQ
   * POST: admin/faqs/{id}/pin
   */
  pinFaq(id: number): Observable<FaqSingleResponse> {
    return this.http.post<FaqSingleResponse>(`${this.faqApiUrl}/${id}/pin`, {});
  }

  /**
   * Unpin a FAQ
   * POST: admin/faqs/{id}/unpin
   */
  unpinFaq(id: number): Observable<FaqSingleResponse> {
    return this.http.post<FaqSingleResponse>(`${this.faqApiUrl}/${id}/unpin`, {});
  }

  /**
   * Toggle FAQ pin status (pin/unpin based on current status)
   */
  toggleFaqPin(id: number, isCurrentlyPinned: boolean): Observable<FaqSingleResponse> {
    if (isCurrentlyPinned) {
      return this.unpinFaq(id);
    } else {
      return this.pinFaq(id);
    }
  }

  /**
   * Toggle FAQ active status
   * You might need a custom endpoint or use updateFaq
   */
  toggleFaqStatus(id: number, isActive: boolean): Observable<FaqSingleResponse> {
    return this.updateFaq(id, { is_active: isActive });
  }
}
