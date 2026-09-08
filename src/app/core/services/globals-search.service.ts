// shared/services/global-search.service.ts
import { Injectable, inject } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiSession } from '../../dashboard/pages/sessions/models/session.model';
import { SessionsService } from '../../dashboard/pages/sessions/services/sessions.service';
import { SubscriptionsService } from '../../dashboard/pages/subscription-management/services/subscriptions.service';
import { Store } from '../../dashboard/pages/user-database/models/store.model';
import { User } from '../../dashboard/pages/user-database/models/user-database.model';
import { UserDatabaseService } from '../../dashboard/pages/user-database/services/user-database.service';

export interface GlobalSearchResults {
  users: User[];
  stores: Store[];
  sessions: ApiSession[];
}

const EMPTY_RESULTS: GlobalSearchResults = { users: [], stores: [], sessions: [] };
const RESULTS_LIMIT = 5;

@Injectable({ providedIn: 'root' })
export class GlobalSearchService {
  private readonly usersService = inject(UserDatabaseService);
  private readonly storesService = inject(SubscriptionsService);
  private readonly sessionsService = inject(SessionsService);

  search(term: string): Observable<GlobalSearchResults> {
    const query = term.trim();
    if (!query) {
      return of(EMPTY_RESULTS);
    }

    return forkJoin({
      users: this.usersService.getUsers(1, RESULTS_LIMIT, query).pipe(
        map((res) => res.data ?? []),
        catchError(() => of([])),
      ),
      stores: this.storesService.getStores(1, query).pipe(
        map((res) => res.data ?? []),
        catchError(() => of([])),
      ),
      sessions: this.sessionsService
        .getAdminSessions({ page: 1, per_page: RESULTS_LIMIT, search: query })
        .pipe(
          map((res) => res.data?.data?.data ?? []),
          catchError(() => of([])),
        ),
    });
  }
}
