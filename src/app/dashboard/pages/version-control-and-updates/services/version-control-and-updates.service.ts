import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import {
  AppApplication,
  AppDetailResponse,
  GroupedVersionsResponse,
  InstalledVersion,
  Pagination,
  Store,
  StoreAppInfo,
  StoreBranch,
  StoreListFilters,
  StoreListMeta,
  StoreListResponse,
  UpdateCampaignPayload,
} from '../models/version-stores.model';

export type MerchantAppType = 'admin' | 'employee';

export interface MerchantApp {
  id: string;
  type: MerchantAppType;
  badgeLabel: string;
  badgeColor: string;
  badgeBgColor: string;
  name: string;
  devicesCount: number;
  activeDevices: number;
  version: string;
  iconUrl: string;
  installedVersions: InstalledVersion[];
}

export interface Merchant {
  id: number;
  name: string;
  code: string;
  ownerName: string;
  location: string;
  apps: MerchantApp[];
  branches: StoreBranch[];
}

export interface StoreListResult {
  merchants: Merchant[];
  pagination: Pagination;
  meta: StoreListMeta | null;
}

interface AppBadge {
  badgeLabel: string;
  badgeColor: string;
  badgeBgColor: string;
}

const UP_TO_DATE_BADGE: AppBadge = {
  badgeLabel: 'محدث',
  badgeColor: '#065F46',
  badgeBgColor: '#ECFDF5',
};

// The API returns "latest" and "outdated". Anything else falls back to a neutral badge
// (previously an unknown status was shown as "up to date", which is misleading).
const STATUS_BADGES: Record<string, AppBadge> = {
  latest: UP_TO_DATE_BADGE,
  'up-to-date': UP_TO_DATE_BADGE,
  outdated: { badgeLabel: 'متأخر', badgeColor: '#C2410C', badgeBgColor: '#FFF4E6' },
  updating: { badgeLabel: 'قيد التحديث', badgeColor: '#B45309', badgeBgColor: '#FFFAEB' },
};

const UNKNOWN_BADGE: AppBadge = {
  badgeLabel: 'غير محدد',
  badgeColor: '#475569',
  badgeBgColor: '#F1F5F9',
};

@Injectable({
  providedIn: 'root',
})
export class VersionControlAndUpdatesService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiUrl = environment.baseAPIURL;

  getStores(filters: StoreListFilters): Observable<StoreListResult> {
    let params = new HttpParams()
      .set('page', filters.page.toString())
      .set('per_page', filters.per_page.toString());

    if (filters.search) {
      params = params.set('search', filters.search);
    }

    params = this.appendVersions(params, 'admin_versions[]', filters.admin_versions);
    params = this.appendVersions(params, 'employee_versions[]', filters.employee_versions);
    params = this.appendVersions(params, 'versions[]', filters.versions);

    return this.httpClient
      .get<StoreListResponse>(`${this.apiUrl}/admin/app-versions/stores`, { params })
      .pipe(
        map((response) => ({
          merchants: this.transformStores(response.data),
          pagination: response.pagination,
          meta: response.meta ?? null,
        })),
      );
  }

  getGroupedVersions(): Observable<GroupedVersionsResponse> {
    return this.httpClient.get<GroupedVersionsResponse>(
      `${this.apiUrl}/admin/app-versions/versions-grouped`,
      { headers: new HttpHeaders({ 'Accept-Language': 'ar' }) },
    );
  }

  // Details popup for one store (optionally one branch) and one app
  getStoreAppDetail(
    storeId: number,
    application: AppApplication,
    branchId?: number | null,
  ): Observable<AppDetailResponse> {
    let params = new HttpParams().set('application', application);
    if (branchId) {
      params = params.set('branch_id', branchId.toString());
    }
    return this.httpClient.get<AppDetailResponse>(
      `${this.apiUrl}/admin/app-versions/stores/${storeId}/detail`,
      { params },
    );
  }

  // "تنبيه بالتحديث" (type: notification) and "تحديث اجباري" (type: force)
  createUpdateCampaign(payload: UpdateCampaignPayload): Observable<unknown> {
    return this.httpClient.post(`${this.apiUrl}/admin/app-update-campaigns`, payload);
  }

  private appendVersions(
    params: HttpParams,
    key: string,
    versions: string[] | undefined,
  ): HttpParams {
    return (versions ?? []).reduce((result, version) => result.append(key, version), params);
  }

  private transformStores(stores: Store[]): Merchant[] {
    return stores.map((store) => ({
      id: store.store_id,
      name: store.store_name,
      code: store.code,
      ownerName: store.owner_name,
      location: store.city || store.governorate || 'غير محدد',
      apps: [
        this.transformApp(store.admin_app, 'admin', store.store_id),
        this.transformApp(store.employee_app, 'employee', store.store_id),
      ],
      branches: store.branches ?? [],
    }));
  }

  private transformApp(
    appInfo: StoreAppInfo | null | undefined,
    type: MerchantAppType,
    storeId: number,
  ): MerchantApp {
    const badge = this.getStatusBadge(appInfo?.status);

    return {
      id: `${storeId}-${type}`,
      type,
      name: type === 'admin' ? 'تطبيق المسؤول' : 'تطبيق الموظفين',
      devicesCount: appInfo?.devices_count ?? 0,
      activeDevices: appInfo?.active_devices ?? 0,
      version: this.normalizeVersion(appInfo?.latest_version),
      iconUrl: 'assets/icons/global/blue_check.svg',
      installedVersions: appInfo?.installed_versions ?? [],
      ...badge,
    };
  }

  // The API already sends "v1.0.7", the old template added another "v" in front ("vv1.0.7")
  private normalizeVersion(version: string | null | undefined): string {
    const value = (version ?? '').trim();
    if (!value) return '-';
    return /^v/i.test(value) ? value : `v${value}`;
  }

  private getStatusBadge(status: string | null | undefined): AppBadge {
    if (!status) return UNKNOWN_BADGE;
    return STATUS_BADGES[status.toLowerCase()] ?? UNKNOWN_BADGE;
  }
}