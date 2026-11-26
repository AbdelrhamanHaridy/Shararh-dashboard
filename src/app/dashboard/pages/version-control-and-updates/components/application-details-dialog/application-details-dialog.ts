import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subscription } from 'rxjs';
import { ToastService } from '../../../../shared/services/toast.service';
import { VersionControlAndUpdatesService } from '../../services/version-control-and-updates.service';
import {
  AppApplication,
  AppDetailBranch,
  AppDetailData,
  AppDetailVersion,
  UpdateCampaignType,
} from '../../models/version-stores.model';
import {
  CustomizeTheUpdateMessageDialog,
  UpdateMessage,
} from '../customize-the-update-message-dialog/customize-the-update-message-dialog';

@Component({
  selector: 'app-application-details-dialog',
  providers: [DialogService],
  templateUrl: './application-details-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationDetailsDialog implements OnInit {
  private readonly config = inject(DynamicDialogConfig);
  private readonly dialogService = inject(DialogService);
  private readonly versionService = inject(VersionControlAndUpdatesService);
  private readonly toastService = inject(ToastService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly storeId: number | null = this.config.data?.storeId ?? null;
  private readonly application: AppApplication = this.config.data?.application ?? 'employee';

  details = signal<AppDetailData | null>(null);
  // Kept from the unfiltered response so the branch chips stay available after picking one
  allBranches = signal<AppDetailBranch[]>([]);
  selectedBranchId = signal<number | null>(this.config.data?.branchId ?? null);
  isLoading = signal(true);
  loadError = signal(false);
  sending = signal<{ versionId: number; type: UpdateCampaignType } | null>(null);

  private detailsRequest?: Subscription;

  ngOnInit(): void {
    this.loadDetails();
  }

  loadDetails(options: { silent?: boolean } = {}): void {
    if (this.storeId === null) {
      this.isLoading.set(false);
      this.loadError.set(true);
      return;
    }

    if (!options.silent) {
      this.isLoading.set(true);
      this.loadError.set(false);
    }

    this.detailsRequest?.unsubscribe();
    this.detailsRequest = this.versionService
      .getStoreAppDetail(this.storeId, this.application, this.selectedBranchId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.details.set(res.data);
          if (this.selectedBranchId() === null) {
            this.allBranches.set(res.data.branches ?? []);
          }
          this.isLoading.set(false);
          this.loadError.set(false);
        },
        error: (err) => {
          console.error('Failed to load application details', err);
          if (!options.silent) {
            this.loadError.set(true);
          }
          this.isLoading.set(false);
        },
      });
  }

  selectBranch(branchId: number | null): void {
    if (this.selectedBranchId() === branchId) return;
    this.selectedBranchId.set(branchId);
    this.loadDetails();
  }

  isSending(version: AppDetailVersion): boolean {
    return this.sending()?.versionId === version.app_version_id;
  }

  // ---------- Update campaigns ----------
  onNotifyUpdate(version: AppDetailVersion): void {
    this.askForMessage(version, 'notification');
  }

  onForceUpdate(version: AppDetailVersion): void {
    this.askForMessage(version, 'force');
  }

  // Both actions go through the same "customize message" dialog, then POST the campaign
  private askForMessage(version: AppDetailVersion, type: UpdateCampaignType): void {
    const ref = this.dialogService.open(CustomizeTheUpdateMessageDialog, {
      width: '404px',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: { type, version: version.version_formatted },
    });

    ref?.onClose.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((message?: UpdateMessage) => {
      if (message) {
        this.sendCampaign(version, type, message);
      }
    });
  }

  private sendCampaign(
    version: AppDetailVersion,
    type: UpdateCampaignType,
    message: UpdateMessage,
  ): void {
    this.sending.set({ versionId: version.app_version_id, type });

    this.versionService
      .createUpdateCampaign({
        application: this.application,
        version_id: version.app_version_id,
        type,
        title: message.title,
        message: message.message,
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.sending.set(null);
          this.toastService.success(
            'تم الإرسال',
            type === 'force'
              ? 'تم تفعيل التحديث الإجباري بنجاح'
              : 'تم إرسال التنبيه بالتحديث بنجاح',
          );
          // can_notify / is_force_update may have changed
          this.loadDetails({ silent: true });
        },
        error: (err) => {
          this.sending.set(null);
          console.error('Failed to create update campaign', err);
          this.toastService.error('فشل الإرسال', this.getErrorMessage(err));
        },
      });
  }

  private getErrorMessage(err: any): string {
    const firstFieldError = Object.values(err?.error?.errors ?? {})[0] as string[] | undefined;
    return err?.error?.message || firstFieldError?.[0] || 'حدث خطأ، يرجى المحاولة مرة أخرى';
  }
}
