// header.ts
import {
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../../dashboard/pages/auth/services/auth.service';
import {
  SessionService,
  CurrentSessionResponse,
} from '../../../dashboard/pages/auth/services/session.service';
import { GlobalSearchService, GlobalSearchResults } from '../../services/globals-search.service';
import { ApiSession } from '../../../dashboard/pages/sessions/models/session.model';
import { Store } from '../../../dashboard/pages/user-database/models/store.model';
import { User } from '../../../dashboard/pages/user-database/models/user-database.model';

export type SearchScope = 'all' | 'users' | 'stores' | 'sessions';

interface ScopeOption {
  value: SearchScope;
  label: string;
}

@Component({
  selector: 'app-header',
  imports: [CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit, OnDestroy {
  private readonly authService = inject(AuthService);
  private readonly sessionService = inject(SessionService);
  private readonly globalSearchService = inject(GlobalSearchService);
  private readonly router = inject(Router);
  private readonly elementRef = inject(ElementRef);

  openMenu = signal(false);
  currentSession = signal<CurrentSessionResponse | null>(null);
  isLoadingSession = signal(false);

  searchTerm = signal('');
  isSearching = signal(false);
  searchResults = signal<GlobalSearchResults | null>(null);
  showSearchResults = signal(false);

  // NEW: search scope filter, defaults to 'all'
  searchScope = signal<SearchScope>('all');
  scopeOptions: ScopeOption[] = [
    { value: 'all', label: 'الكل' },
    { value: 'users', label: 'المستخدمين' },
    { value: 'stores', label: 'المحلات' },
    { value: 'sessions', label: 'الجلسات' },
  ];

  private readonly searchTerm$ = new Subject<string>();
  private readonly destroy$ = new Subject<void>();

  user = computed(() => this.authService.getCurrentUser());

  avatarSrc = computed(() => {
    const u = this.user();
    return u?.avatar_url || 'assets/testing/avatar.png';
  });

  isEmployee = computed(() => {
    const u = this.user();
    if (!u) return false;
    const roles: string[] = Array.isArray(u.roles) ? u.roles : [];
    const employeeRoles = ['supervisor', 'customer_service', 'sales', 'technical_support'];
    return roles.some((r) => employeeRoles.includes(r));
  });

  hasActiveSession = computed(() => {
    const session = this.currentSession();
    return session?.success && session.data?.session?.status === 'active';
  });

  // NEW: results narrowed to the selected scope. When scope is 'all',
  // every category is returned as-is; otherwise only the matching one
  // is kept (others emptied) so counts/badges stay consistent.
  filteredResults = computed<GlobalSearchResults | null>(() => {
    const results = this.searchResults();
    if (!results) return null;

    const scope = this.searchScope();
    if (scope === 'all') return results;

    return {
      users: scope === 'users' ? results.users : [],
      stores: scope === 'stores' ? results.stores : [],
      sessions: scope === 'sessions' ? results.sessions : [],
    };
  });

  hasSearchResults = computed(() => {
    const results = this.filteredResults();
    if (!results) return false;
    return results.users.length > 0 || results.stores.length > 0 || results.sessions.length > 0;
  });

  // NEW: per-scope counts from the *unfiltered* results, so tab badges
  // reflect what's actually available regardless of the active tab
  scopeCount(scope: SearchScope): number {
    const results = this.searchResults();
    if (!results) return 0;
    if (scope === 'all') {
      return results.users.length + results.stores.length + results.sessions.length;
    }
    return results[scope].length;
  }

  ngOnInit(): void {
    if (this.isEmployee()) {
      this.loadCurrentSession();
    }

    this.searchTerm$
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((term) => {
          const query = term.trim();
          if (!query) {
            this.isSearching.set(false);
            return of(null);
          }
          this.isSearching.set(true);
          return this.globalSearchService.search(query);
        }),
        takeUntil(this.destroy$),
      )
      .subscribe({
        next: (results) => {
          this.isSearching.set(false);
          this.searchResults.set(results);
          this.showSearchResults.set(results !== null);
        },
        error: () => {
          this.isSearching.set(false);
          this.searchResults.set(null);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showSearchResults.set(false);
      this.openMenu.set(false);
    }
  }

  onSearchInput(value: string): void {
    this.searchTerm.set(value);
    this.searchTerm$.next(value);
    if (!value.trim()) {
      this.showSearchResults.set(false);
      this.searchResults.set(null);
    }
  }

  onSearchFocus(): void {
    if (this.searchTerm().trim() && this.searchResults()) {
      this.showSearchResults.set(true);
    }
  }

  // NEW: switch tabs without re-triggering the debounced search —
  // we already have all categories' results client-side
  selectScope(scope: SearchScope): void {
    this.searchScope.set(scope);
  }

  goToUser(user: User): void {
    this.resetSearch();
    // Opens the users table pre-filtered by this user's email
    this.router.navigate(['/user-database'], { queryParams: { search: user.email } });
  }

  goToStore(store: Store): void {
    this.resetSearch();
    // Opens the stores table pre-filtered by this store's name
    this.router.navigate(['/subscriptions/stores'], { queryParams: { search: store.name } });
  }

  goToSession(session: ApiSession): void {
    this.resetSearch();
    // Sessions stay as direct navigation to the details page (no list filtering per your note)
    this.router.navigate(['/sessions/session-details', session.id]);
  }

  private resetSearch(): void {
    this.showSearchResults.set(false);
    this.searchTerm.set('');
    this.searchResults.set(null);
    this.searchScope.set('all'); // reset to default on close
  }

  toggleMenu(): void {
    this.openMenu.set(!this.openMenu());
  }

  startSession(): void {
    this.router.navigate(['/auth/start-session']);
  }

  endSession(): void {
    const session = this.currentSession();
    if (!session?.data?.session?.id) return;

    this.isLoadingSession.set(true);
    this.sessionService.endSession(session.data.session.id).subscribe({
      next: () => {
        this.isLoadingSession.set(false);
        this.currentSession.set(null);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoadingSession.set(false);
        console.error('Failed to end session:', error);
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }

  loadCurrentSession(): void {
    this.sessionService.getCurrentSession().subscribe({
      next: (response) => {
        if (response.success && response.data?.session?.status === 'active') {
          this.currentSession.set(response);
        } else {
          this.currentSession.set(null);
        }
      },
      error: (error) => {
        if (error?.status === 404) {
          this.currentSession.set(null);
        } else {
          console.error('Failed to load session:', error);
          this.currentSession.set(null);
        }
      },
    });
  }
}
