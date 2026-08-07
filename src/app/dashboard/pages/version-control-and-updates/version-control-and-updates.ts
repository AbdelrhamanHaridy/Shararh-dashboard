import { Component, OnInit, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { FilterByVersionDialog } from './components/filter-by-version-dialog/filter-by-version-dialog';
import { EmployeeApplicationDetailsDialog } from './components/employee-application-details-dialog/employee-application-details-dialog';
import { AdminApplicationDetailsDialog } from './components/admin-application-details-dialog/admin-application-details-dialog';
import { BaseComponent } from '../../shared/services/base.component';
import {
  VersionControlAndUpdatesService,
  Merchant,
} from './services/version-control-and-updates.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-version-control-and-updates',
  imports: [PageHeaderComponent],
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
  isLoading = signal(false);

  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };
  breadcrumbItems: MenuItem[] = [
    { label: 'إدارة النسخ والتحديثات', routerLink: '/version-control-and-updates' },
  ];

  ngOnInit(): void {
    this.loadStores();
  }

  private loadStores(): void {
    this.isLoading.set(true);
    this.versionService
      .getStores()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          this.merchants.set(data);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  onOpenFilterByVersion(): void {
    this.ref = this.dialogService.open(FilterByVersionDialog, {
      // header: 'تصفية بالإصدار',
      width: '520px',
      modal: true,
      // closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        context: 'version-filter',
      },
    });
  }

  onOpenEmployeeApplicationDetails(merchantId: number, appId: string): void {
    this.ref = this.dialogService.open(AdminApplicationDetailsDialog, {
      header: 'تفاصيل تطبيق الموظفين',
      width: '520px',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        merchantId,
        appId,
      },
    });
  }
}
