import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Subscription, Subject, debounceTime, distinctUntilChanged, map, takeUntil } from 'rxjs';
import { PaginatorModule } from 'primeng/paginator';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { VersionCardSkeleton } from './components/version-card-skeleton/version-card-skeleton';
import { BaseComponent } from '../../shared/services/base.component';
import {
  VersionControlAndUpdatesService,
  Merchant,
  MerchantApp,
} from './services/version-control-and-updates.service';
import {
  StoreListFilters,
  StoreListMeta,
  StoreVersionFilters,
} from './models/version-stores.model';
import { FilterByVersionDialog } from './components/filter-by-version-dialog/filter-by-version-dialog';
import { ApplicationDetailsDialog } from './components/application-details-dialog/application-details-dialog';

const EMPTY_FILTERS: StoreVersionFilters = {
  admin_versions: [],
  employee_versions: [],
  versions: [],
};

@Component({
  selector: 'app-version-control-and-updates',
  imports: [PageHeaderComponent, VersionCardSkeleton, PaginatorModule],
  providers: [DialogService],
  templateUrl: './version-control-and-updates.html',
  styleUrl: './version-control-and-updates.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VersionControlAndUpdates extends BaseComponent implements OnInit {
  ref: DynamicDialogRef | null = null;
  private readonly versionService = inject(VersionControlAndUpdatesService);
  private readonly dialogService = inject(DialogService);

  merchants = signal<Merchant[]>([]);
  isLoading = signal(false); // skeleton: first load, search, filters, paging
  isRefreshing = signal(false); // silent refresh: list stays on screen, only the icon spins
  loadError = signal('');
  searchDraft = signal('');
  totalStores = signal(0);
  currentPage = signal(1);
  meta = signal<StoreListMeta | null>(null);
  readonly perPage = 15;
  versionFilters = signal<StoreVersionFilters>({ ...EMPTY_FILTERS });

  activeFiltersCount = computed(() => {
    const f = this.versionFilters();
    return f.admin_versions.length + f.employee_versions.length + f.versions.length;
  });

  lastUpdatedLabel = computed(() => {
    const meta = this.meta();
    if (!meta) return 'لم يتم التحديث بعد';
    return meta.last_updated_human || meta.last_updated_formatted;
  });

  private readonly searchInput$ = new Subject<string>();
  private storesRequest?: Subscription;
  private searchTerm = '';

  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };
  breadcrumbItems: MenuItem[] = [
    { label: 'إدارة النسخ والتحديثات', routerLink: '/version-control-and-updates' },
  ];

  ngOnInit(): void {
    this.searchInput$
      .pipe(
        debounceTime(400),
        map((term) => term.trim()),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
      )
      .subscribe((term) => {
        this.searchTerm = term;
        this.currentPage.set(1);
        this.loadStores();
      });

    this.loadStores();
  }

  override ngOnDestroy(): void {
    this.storesRequest?.unsubscribe();
    super.ngOnDestroy();
  }

  /**
   * @param silent true = keep the current list on screen during manual refresh.
   *               false = show skeletons (first load, search, filters, paging).
   */
  private loadStores(options: { silent?: boolean } = {}): void {
    const silent = options.silent ?? false;

    if (silent) {
      this.isRefreshing.set(true);
    } else {
      this.isLoading.set(true);
      this.isRefreshing.set(false);
      this.loadError.set('');
    }

    const filters: StoreListFilters = {
      ...this.versionFilters(),
      page: this.currentPage(),
      per_page: this.perPage,
    };
    if (this.searchTerm) {
      filters.search = this.searchTerm;
    }

    this.storesRequest?.unsubscribe();
    this.storesRequest = this.versionService
      .getStores(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.merchants.set(result.merchants);
          this.totalStores.set(result.pagination.total);
          this.currentPage.set(result.pagination.current_page);
          this.meta.set(result.meta);
          this.loadError.set('');
          this.isLoading.set(false);
          this.isRefreshing.set(false);
        },
        error: (error: unknown) => {
          console.error('Failed to load version-control stores', error);
          // A failed background refresh must not wipe a list the user is looking at
          if (!silent) {
            this.loadError.set('تعذر تحميل قائمة المحلات. حاول مرة أخرى.');
          }
          this.isLoading.set(false);
          this.isRefreshing.set(false);
        },
      });
  }

  onSearchChange(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.searchDraft.set(event.target.value);
      this.searchInput$.next(event.target.value);
    }
  }

  onRefresh(): void {
    // Silent when there is something on screen, full loading when the list is empty or in error
    const hasContent = this.merchants().length > 0 && !this.loadError();
    this.loadStores({ silent: hasContent });
  }

  onStoresPageChange(event: { page?: number | null }): void {
    if (typeof event.page === 'number') {
      const page = event.page + 1;
      if (page !== this.currentPage()) {
        this.currentPage.set(page);
        this.loadStores();
      }
    }
  }

  onOpenFilterByVersion(): void {
    this.ref = this.dialogService.open(FilterByVersionDialog, {
      width: '520px',
      modal: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        context: 'version-filter',
        filters: this.versionFilters(),
      },
    });
    this.ref?.onClose.pipe(takeUntil(this.destroy$)).subscribe((filters?: StoreVersionFilters) => {
      if (!filters) {
        return;
      }
      this.applyFilters(filters);
    });
  }

  onClearVersionFilters(): void {
    this.applyFilters({ ...EMPTY_FILTERS });
  }

  private applyFilters(filters: StoreVersionFilters): void {
    this.versionFilters.set(filters);
    this.currentPage.set(1);
    this.loadStores();
  }

  // One shared dialog for both apps: the API returns the same shape and only `application` differs
  onOpenApplicationDetails(merchant: Merchant, app: MerchantApp): void {
    this.ref = this.dialogService.open(ApplicationDetailsDialog, {
      header: app.type === 'admin' ? 'تفاصيل تطبيق الأدمن' : 'تفاصيل تطبيق الموظفين',
      width: '520px',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        storeId: merchant.id,
        application: app.type,
        merchantName: merchant.name,
      },
    });
  }
}
