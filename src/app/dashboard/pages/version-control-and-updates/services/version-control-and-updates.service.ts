import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StoreListResponse, Store } from '../models/version-stores.model';
import { environment } from '../../../../../environments/environment';

export interface MerchantApp {
  id: string;
  badgeLabel: string;
  badgeColor: string;
  badgeBgColor: string;
  name: string;
  devicesCount: number;
  version: string;
  iconUrl: string;
}

export interface Merchant {
  id: number;
  name: string;
  location: string;
  apps: MerchantApp[];
}

@Injectable({
  providedIn: 'root',
})
export class VersionControlAndUpdatesService {
  private readonly httpClient = inject(HttpClient);
  private apiUrl = environment.baseAPIURL;

  getStores(): Observable<Merchant[]> {
    return this.httpClient
      .get<StoreListResponse>(`${this.apiUrl}/admin/app-versions/stores`)
      .pipe(map((response) => this.transformStores(response.data)));
  }

  private transformStores(stores: Store[]): Merchant[] {
    return stores.map((store) => ({
      id: store.store_id,
      name: store.store_name,
      location: store.city || 'غير محدد',
      apps: [
        this.transformApp(store.admin_app, `${store.store_id}-admin`, 'تطبيق المسؤول'),
        this.transformApp(store.employee_app, `${store.store_id}-employee`, 'تطبيق الموظفين'),
      ],
    }));
  }

  private transformApp(appInfo: any, id: string, appName: string): MerchantApp {
    const { badgeLabel, badgeColor, badgeBgColor } = this.getStatusBadge(appInfo.status);

    return {
      id,
      name: appName,
      devicesCount: appInfo.devices_count || 0,
      version: appInfo.latest_version || '0.0.0',
      badgeLabel,
      badgeColor,
      badgeBgColor,
      iconUrl: 'assets/icons/global/blue_check.svg',
    };
  }

  private getStatusBadge(status: any): {
    badgeLabel: string;
    badgeColor: string;
    badgeBgColor: string;
  } {
    // Default badge for latest version
    if (status === null || status === undefined) {
      return {
        badgeLabel: 'غير محدد',
        badgeColor: '#065F46',
        badgeBgColor: '#ECFDF5',
      };
    }

    // Map different statuses to badge colors
    const statusMap: Record<
      string,
      { badgeLabel: string; badgeColor: string; badgeBgColor: string }
    > = {
      'up-to-date': {
        badgeLabel: 'محدث',
        badgeColor: '#065F46',
        badgeBgColor: '#ECFDF5',
      },
      outdated: {
        badgeLabel: 'متأخر',
        badgeColor: '#C2410C',
        badgeBgColor: '#FFF4E6',
      },
      updating: {
        badgeLabel: 'قيد التحديث',
        badgeColor: '#B45309',
        badgeBgColor: '#FFFAEB',
      },
    };

    return statusMap[String(status).toLowerCase()] || statusMap['up-to-date'];
  }
}
