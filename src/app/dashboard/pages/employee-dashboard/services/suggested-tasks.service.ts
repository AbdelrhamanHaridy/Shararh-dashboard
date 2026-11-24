import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { SuggestedTasksResponse } from '../models/suggested-tasks.model';

@Injectable({
  providedIn: 'root',
})
export class SuggestedTasksService {
  private apiUrl = environment.baseAPIURL + '/admin/suggested-tasks';

  constructor(private http: HttpClient) {}

  getSuggestedTasks(): Observable<SuggestedTasksResponse> {
    return this.http.get<SuggestedTasksResponse>(this.apiUrl);
  }
}
