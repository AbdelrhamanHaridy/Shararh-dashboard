import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { GroupedAppVersion, StoreVersionFilters } from '../../models/version-stores.model';
import { VersionControlAndUpdatesService } from '../../services/version-control-and-updates.service';

// The popup only filters by admin app and employee app versions (as in the docs).
// The generic `versions[]` param is still supported by the service but is not offered here.
type VersionFilterKey = 'admin_versions' | 'employee_versions';

interface VersionGroup {
  id: VersionFilterKey;
  title: string;
  selectedVersions: string[];
  options: GroupedAppVersion[];
}

@Component({
  selector: 'app-filter-by-version-dialog',
  standalone: true,
  imports: [],
  templateUrl: './filter-by-version-dialog.html',
  styleUrl: './filter-by-version-dialog.scss',
})
export class FilterByVersionDialog implements OnInit, OnDestroy {
  groups: VersionGroup[] = [];
  isLoading = true;
  loadError = '';

  private readonly selectedFilters: StoreVersionFilters;
  private versionsRequest?: Subscription;

  constructor(
    private readonly ref: DynamicDialogRef,
    config: DynamicDialogConfig,
    private readonly versionService: VersionControlAndUpdatesService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.selectedFilters = (config.data?.filters as StoreVersionFilters | undefined) ?? {
      admin_versions: [],
      employee_versions: [],
      versions: [],
    };
  }

  get selectedCount(): number {
    return this.groups.reduce((total, group) => total + group.selectedVersions.length, 0);
  }

  ngOnInit(): void {
    this.loadVersions();
  }

  ngOnDestroy(): void {
    this.versionsRequest?.unsubscribe();
  }

  private loadVersions(): void {
    this.versionsRequest?.unsubscribe();
    this.isLoading = true;
    this.loadError = '';

    this.versionsRequest = this.versionService.getGroupedVersions().subscribe({
      next: (response) => {
        this.groups = [
          {
            id: 'admin_versions',
            title: 'إصدارات تطبيق الأدمن',
            selectedVersions: [...(this.selectedFilters.admin_versions ?? [])],
            options: response.data.admin_app_versions ?? [],
          },
          {
            id: 'employee_versions',
            title: 'إصدارات تطبيق الموظفين',
            selectedVersions: [...(this.selectedFilters.employee_versions ?? [])],
            options: response.data.employee_app_versions ?? [],
          },
        ];
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error: unknown) => {
        console.error('Failed to load grouped application versions', error);
        this.loadError = 'تعذر تحميل قائمة الإصدارات';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  retryLoadingVersions(): void {
    this.loadVersions();
  }

  isVersionSelected(group: VersionGroup, version: string): boolean {
    return group.selectedVersions.includes(version);
  }

  toggleVersionSelection(group: VersionGroup, version: string): void {
    group.selectedVersions = this.isVersionSelected(group, version)
      ? group.selectedVersions.filter((selectedVersion) => selectedVersion !== version)
      : [...group.selectedVersions, version];
  }

  // "مسح الكل": closes with empty filters, the page reloads the list without version filters
  onClearAll(): void {
    this.ref.close({
      admin_versions: [],
      employee_versions: [],
      versions: [],
    } satisfies StoreVersionFilters);
  }

  onClose(): void {
    this.ref.close();
  }

  onApplyFilter(): void {
    if (this.isLoading || this.loadError) {
      return;
    }

    const filters: StoreVersionFilters = {
      admin_versions: [],
      employee_versions: [],
      versions: [],
    };
    for (const group of this.groups) {
      filters[group.id] = [...group.selectedVersions];
    }
    this.ref.close(filters);
  }
}