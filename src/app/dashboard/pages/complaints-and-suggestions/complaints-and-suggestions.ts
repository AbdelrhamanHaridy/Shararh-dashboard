import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { MenuItem, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TieredMenuModule, TieredMenu } from 'primeng/tieredmenu';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SharedKpiCard } from '../../shared/components/shared-kpi-card/shared-kpi-card';
import { SharedSelectComponent } from '../../shared/components/shared-select/shared-select.component';
import { SharedTextInputComponent } from '../../shared/components/shared-text-input/shared-text-input.component';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged, Subject, takeUntil, forkJoin } from 'rxjs';
import { BaseComponent } from '../../shared/services/base.component';
import { CustomerRequestsService } from './services/customer-requests.service';
import {
  CustomerRequest,
  CustomerRequestFilterParams,
  CustomerRequestPayload,
  CustomerRequestStats,
  CustomerRequestStatus,
} from './models/customer-request.model';
import { EditRequestDialog } from './components/edit-request-dialog/edit-request-dialog';
import { SkeletonModule } from 'primeng/skeleton';

@Component({
  selector: 'app-complaints-and-suggestions',
  imports: [
    PageHeaderComponent,
    SharedKpiCard,
    SharedSelectComponent,
    SharedTextInputComponent,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    ConfirmDialogModule,
    TieredMenuModule,
    DynamicDialogModule,
    SkeletonModule,
  ],
  providers: [ConfirmationService, DialogService],
  templateUrl: './complaints-and-suggestions.html',
  styleUrl: './complaints-and-suggestions.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplaintsAndSuggestions extends BaseComponent implements OnInit {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };
  breadcrumbItems: MenuItem[] = [
    { label: 'الشكاوى والاقتراحات', routerLink: '/complaints-and-suggestions' },
  ];

  stats: CustomerRequestStats | null = null;
  isLoadingStats = false;

  statusOptions = [
    { label: 'قيد الانتظار', value: 'pending' },
    { label: 'قيد المراجعة', value: 'reviewing' },
    { label: 'تم الحل', value: 'resolved' },
    { label: 'ملغي', value: 'cancelled' },
  ];

  categoryOptions = [
    { label: 'المديونيات', value: 'debts' },
    { label: 'المحافظ', value: 'wallets' },
    { label: 'المعاملات', value: 'transactions' },
    { label: 'الورديات', value: 'shifts' },
    { label: 'التحويلات', value: 'transfers' },
    { label: 'إقفال اليوم', value: 'day_closing' },
    { label: 'أخرى', value: 'other' },
  ];

  sourceOptions = [
    { label: 'واتساب', value: 'whatsapp' },
    { label: 'هاتف', value: 'phone' },
    { label: 'فيسبوك', value: 'facebook' },
    { label: 'التطبيق', value: 'app' },
    { label: 'كاشير', value: 'cashier' },
    { label: 'محصل', value: 'collector' },
    { label: 'الإدارة', value: 'admin' },
    { label: 'أخرى', value: 'other' },
  ];

  departmentOptions = [
    { label: 'عام', value: 'general' },
    { label: 'المديونيات', value: 'debts' },
    { label: 'المحافظ', value: 'wallets' },
    { label: 'الكاشير', value: 'cashier' },
    { label: 'التحصيل', value: 'collector' },
    { label: 'الحسابات', value: 'accounting' },
    { label: 'الدعم الفني', value: 'support' },
    { label: 'أخرى', value: 'other' },
  ];

  statusBadgeMeta: Record<string, { color: string; bg: string }> = {
    pending: { color: '#F97316', bg: '#F973161A' },
    reviewing: { color: '#2563EB', bg: '#3B82F61A' },
    resolved: { color: '#059669', bg: '#D1FAE5' },
    cancelled: { color: '#DC2626', bg: '#FEE2E2' },
  };

  statusChangeOptions: { label: string; value: CustomerRequestStatus }[] = [
    { label: 'قيد الانتظار', value: 'pending' },
    { label: 'قيد المراجعة', value: 'reviewing' },
    { label: 'تم الحل', value: 'resolved' },
    { label: 'ملغي', value: 'cancelled' },
  ];

  // Add form — kept inline as before
  requestForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  requests: CustomerRequest[] = [];
  isLoading = true;
  listErrorMessage = '';

  searchTerm = '';
  private searchChanged = new Subject<string>();
  activeStatusFilter: string | null = null;

  statusFilters = [
    { label: 'الكل', value: null },
    { label: 'قيد الانتظار', value: 'pending' },
    { label: 'قيد المراجعة', value: 'reviewing' },
    { label: 'تم الحل', value: 'resolved' },
    { label: 'ملغي', value: 'cancelled' },
  ];

  constructor(
    private fb: FormBuilder,
    private requestsService: CustomerRequestsService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    this.initForm();
    this.refreshAll();

    this.searchChanged
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        this.searchTerm = term;
        this.refreshAll();
      });
  }

  initForm() {
    this.requestForm = this.fb.group({
      customer_name: ['', Validators.required],
      phone: ['', Validators.required],
      type: ['complaint', Validators.required],
      status: ['pending', Validators.required],
      category: ['', Validators.required],
      source: ['', Validators.required],
      department: ['', Validators.required],
      branch_id: [null, Validators.required],
      assigned_user_id: [null],
      details: ['', Validators.required],
      admin_notes: [''],
    });
  }

  selectType(type: 'complaint' | 'suggestion') {
    this.requestForm.patchValue({ type });
  }

  private get activeFilters(): CustomerRequestFilterParams {
    const filters: CustomerRequestFilterParams = {};
    if (this.searchTerm) filters.search = this.searchTerm;
    if (this.activeStatusFilter) filters.status = this.activeStatusFilter;
    return filters;
  }

  refreshAll() {
    this.isLoading = true;
    this.listErrorMessage = '';

    forkJoin([
      this.requestsService.getCustomerRequests(this.activeFilters),
      this.requestsService.getStats(this.activeFilters),
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: ([requestsRes, statsRes]) => {
          this.requests = requestsRes.data ?? [];
          this.stats = statsRes.data.stats;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error fetching data:', err);
          this.listErrorMessage = 'حدث خطأ أثناء تحميل البيانات';
          this.isLoading = false;
          this.cdr.markForCheck();
        },
      });
  }

  onGetRequests() {
    this.requestsService
      .getCustomerRequests(this.activeFilters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.requests = res.data ?? [];
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error fetching customer requests:', err);
          this.listErrorMessage = 'حدث خطأ أثناء تحميل السجل';
          this.cdr.markForCheck();
        },
      });
  }

  onGetStats() {
    this.requestsService
      .getStats(this.activeFilters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.stats = res.data.stats;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Error fetching stats:', err);
          this.cdr.markForCheck();
        },
      });
  }

  onSearchInput(value: string) {
    this.searchChanged.next(value);
  }

  onSelectStatusFilter(value: string | null) {
    if (this.activeStatusFilter === value) return;
    this.activeStatusFilter = value;
    this.refreshAll();
  }

  isActiveStatusFilter(value: string | null): boolean {
    return this.activeStatusFilter === value;
  }

  trackByRequestId(_index: number, request: CustomerRequest): number {
    return request.id;
  }

  getStatusMeta(status: string) {
    return this.statusBadgeMeta[status] ?? { color: '#64748B', bg: '#F1F5F9' };
  }

  // ADD — inline form submit (unchanged behavior from before)
  onSubmit() {
    if (this.requestForm.invalid) {
      this.requestForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';

    const formValue = this.requestForm.value;
    const payload: CustomerRequestPayload = {
      customer_name: formValue.customer_name,
      phone: formValue.phone,
      type: formValue.type,
      status: formValue.status,
      category: formValue.category,
      source: formValue.source,
      department: formValue.department,
      branch_id: Number(formValue.branch_id),
      assigned_user_id: formValue.assigned_user_id ? Number(formValue.assigned_user_id) : null,
      details: formValue.details,
      admin_notes: formValue.admin_notes || '',
    };

    this.requestsService
      .createCustomerRequest(payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.requests = [res.data.customer_request, ...this.requests];
          this.resetForm();
          this.refreshAll();
        },
        error: (err) => {
          console.error('Error creating customer request:', err);
          this.isSubmitting = false;
          this.errorMessage = 'حدث خطأ أثناء حفظ الطلب، حاول مرة أخرى';
        },
      });
  }

  resetForm() {
    this.requestForm.reset({
      type: 'complaint',
      status: 'pending',
      customer_name: '',
      phone: '',
      category: '',
      source: '',
      department: '',
      branch_id: null,
      assigned_user_id: null,
      details: '',
      admin_notes: '',
    });
  }

  // EDIT — always via dialog now
  onEdit(request: CustomerRequest) {
    const ref = this.dialogService.open(EditRequestDialog, {
      header: 'تعديل شكوى / اقتراح',
      width: '700px',
      modal: true,
      closable: true,
      breakpoints: { '960px': '75vw', '640px': '90vw' },
      data: { request },
    });

    if (ref) {
      ref.onClose
        .pipe(takeUntil(this.destroy$))
        .subscribe((updated: CustomerRequest | undefined) => {
          if (updated) {
            this.refreshAll();
          }
        });
    }
  }

  onChangeStatus(request: CustomerRequest, status: CustomerRequestStatus) {
    if (status === request.status) return;

    this.requestsService
      .updateStatus(request.id, { status, admin_notes: request.admin_notes || '' })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.refreshAll();
        },
        error: (err) => console.error('Error updating status:', err),
      });
  }

  onDelete(request: CustomerRequest) {
    this.confirmationService.confirm({
      message: `هل أنت متأكد من حذف الطلب رقم "${request.request_number}"؟`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'حذف',
      rejectLabel: 'إلغاء',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.requestsService
          .deleteCustomerRequest(request.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => this.refreshAll(),
            error: (err) => console.error('Error deleting request:', err),
          });
      },
    });
  }

  getContextMenu(request: CustomerRequest): MenuItem[] {
    return [
      {
        label: 'تعديل',
        command: () => this.onEdit(request),
      },
      {
        label: 'تغيير الحالة',
        items: this.statusChangeOptions.map((opt) => ({
          label: opt.label,
          styleClass: opt.value === request.status ? 'font-bold text-primary' : '',
          command: () => this.onChangeStatus(request, opt.value),
        })),
      },
      {
        label: 'حذف',
        styleClass: 'text-red-600',
        command: () => this.onDelete(request),
      },
    ];
  }

  onMenuClick(menu: TieredMenu, request: CustomerRequest, event: Event) {
    event.stopPropagation();
    menu.model = this.getContextMenu(request);
    menu.toggle(event);
  }
}
