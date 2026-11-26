import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SharedKpiCard } from '../../shared/components/shared-kpi-card/shared-kpi-card';
import { CustomerCard, Customer } from './components/customer-card/customer-card';
import { CustomerCardSkeleton } from './components/customer-card-skeleton/customer-card-skeleton';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { AddCustomerGroupDialog } from './components/add-customer-group-dialog/add-customer-group-dialog';
import { AddPotentialCustomerDialog } from './components/add-potential-customer-dialog/add-potential-customer-dialog';
import { ChangeStatusDialog } from './components/change-status-dialog/change-status-dialog';
import { Lead, LeadStatistics } from './models/potential-customer-center.model';
import { PotentialCustomerCenterService } from './services/potential-customer-center.service';
import { EditPotentialCustomerDialog } from './components/edit-potential-customer-dialog/edit-potential-customer-dialog';
import { ToastService } from '../../shared/services/toast.service';
import { AssignEmployeeDialog } from './components/assign-employee-dialog/assign-employee-dialog';
import { SharedSelectComponent } from '../../shared/components/shared-select/shared-select.component';

interface EmployeeFilterOption {
  label: string;
  value: number | 'all';
}

// Badge colors per status. Extend as more statuses are confirmed.
const STATUS_STYLE_MAP: Record<string, { color: string; bgColor: string }> = {
  new: { color: '#137FEC', bgColor: '#E3F2FD' },
  interested: { color: '#B4630D', bgColor: '#FFEDC3' },
  contacted: { color: '#B4630D', bgColor: '#FFEDC3' },
  subscribed: { color: '#10A922', bgColor: '#DCFCE7' },
  in_implementation: { color: '#137FEC', bgColor: '#E3F2FD' },
};

const DEFAULT_STATUS_STYLE = { color: '#8A97A8', bgColor: '#F1F5F9' };
const DEFAULT_AVATAR = 'assets/testing/avatar.png';

@Component({
  selector: 'app-potential-customer-center',
  imports: [
    FormsModule,
    SharedKpiCard,
    PageHeaderComponent,
    CustomerCard,
    MenuModule,
    CustomerCardSkeleton,
    SharedSelectComponent,
  ],
  providers: [DialogService],
  templateUrl: './potential-customer-center.html',
  styleUrl: './potential-customer-center.scss',
})
export class PotentialCustomerCenter implements OnInit, OnDestroy {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };
  breadcrumbItems = [{ label: 'مركز العملاء المحتملين' }];

  activeTab: 'potential' | 'underImplementation' = 'potential';

  actionMenuItems: MenuItem[] = [
    {
      label: 'إضافة عميل محتمل',
      command: () => this.showAddPotentialCustomerDialog(),
    },
    {
      label: 'إضافة مجموعة عملاء',
      command: () => this.showAddCustomerGroupDialog(),
    },
    {
      label: 'الارشيف',
      disabled: true,
    },
  ];

  employeeFilterOptions: EmployeeFilterOption[] = [];
  employeeFilterValue: number | 'all' = 'all';
  canFilterAllEmployees = false;
  isLoadingEmployeeOptions = true;
  employeeFilterError = '';

  ref: DynamicDialogRef | null = null;
  private rawLeads: Lead[] = [];
  isLoadingLeads = false;
  loadError = '';

  underImplementationStatus = '';
  readonly underImplementationStatuses = [
    { key: '', label: 'الكل' },
    { key: 'registered', label: 'مسجل' },
    { key: 'subscribed', label: 'مشترك' },
    { key: 'rejected', label: 'مرفوض' },
  ];

  potentialDataFilter: 'all' | 'complete_data' = 'all';
  readonly potentialDataFilters: { value: 'all' | 'complete_data'; label: string }[] = [
    { value: 'all', label: 'الكل' },
    { value: 'complete_data', label: 'بيانات مكتملة' },
  ];

  // Search filter
  searchTerm = '';
  private searchInput$ = new Subject<string>();
  private searchSub?: Subscription;

  potentialCustomers: Customer[] = [];
  underImplementationCustomers: Customer[] = [];

  // Stats for the KPI cards
  stats: LeadStatistics = {
    total_leads: 0,
    available_leads: 0,
    in_progress_leads: 0,
    new_leads: 0,
    contacted_leads: 0,
    interested_leads: 0,
    subscribed_leads: 0,
    rejected_leads: 0,
    today_leads: 0,
    total_points: 0,
    today_points: 0,
  };

  constructor(
    public dialogService: DialogService,
    private potentialCustomerCenterService: PotentialCustomerCenterService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.loadLeads();
    this.loadStats();
    this.loadEmployeeFilterOptions();

    this.searchSub = this.searchInput$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((term) => {
        this.searchTerm = term;
        this.loadLeads();
      });
  }

  private loadEmployeeFilterOptions(): void {
    this.potentialCustomerCenterService.getLeadEmployees().subscribe({
      next: (response) => {
        this.canFilterAllEmployees = response.data.can_filter_all;
        const employees = response.data.employees.map((employee) => ({
          label: employee.name,
          value: employee.id,
        }));

        if (this.canFilterAllEmployees) {
          this.employeeFilterOptions = [{ label: 'كل الموظفين', value: 'all' }, ...employees];
        } else {
          this.employeeFilterOptions = employees;
          const currentEmployee = employees[0];
          if (currentEmployee) {
            this.employeeFilterValue = currentEmployee.value;
          } else {
            this.employeeFilterError = 'تعذر تحديد الموظف المرتبط بهذا الحساب';
          }
        }

        this.isLoadingEmployeeOptions = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed loading employee filter options:', error);
        this.isLoadingEmployeeOptions = false;
        this.employeeFilterError = 'تعذر تحميل قائمة الموظفين';
        this.toastService.error('فشل تحميل الموظفين', this.getErrorMessage(error));
        this.cdr.markForCheck();
      },
    });
  }

  onEmployeeFilterChange(employeeId: number | 'all'): void {
    this.employeeFilterValue = employeeId;
    this.loadLeads();
  }

  ngOnDestroy() {
    this.searchSub?.unsubscribe();
  }

  get currentCustomers() {
    return this.activeTab === 'potential'
      ? this.potentialCustomers
      : this.underImplementationCustomers;
  }

  onSearchInput(value: string) {
    this.searchInput$.next(value);
  }

  private loadLeads(status?: string) {
    this.isLoadingLeads = true;
    this.loadError = '';
    const filters: Record<string, any> = {};

    if (status !== undefined) {
      this.underImplementationStatus = status;
    }

    if (this.activeTab === 'potential') {
      filters['tab'] = 'potential';
      if (this.potentialDataFilter !== 'all') {
        filters['filter'] = this.potentialDataFilter;
      }
    } else {
      filters['tab'] = 'in_progress';
      filters['filter'] = this.underImplementationStatus || 'all';
    }

    if (typeof this.employeeFilterValue === 'number') {
      filters['employee_id'] = this.employeeFilterValue;
    }

    if (this.searchTerm) filters['search'] = this.searchTerm;

    this.potentialCustomerCenterService.getLeads(filters).subscribe({
      next: (res) => {
        if (res && Array.isArray(res.data)) {
          this.rawLeads = res.data;
          const mapped = res.data.map((lead) => this.mapLeadToCustomer(lead));
          this.potentialCustomers = this.activeTab === 'potential' ? mapped : [];
          this.underImplementationCustomers =
            this.activeTab === 'underImplementation' ? mapped : [];
        }
        this.isLoadingLeads = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoadingLeads = false;
        this.loadError = 'تعذر تحميل بيانات العملاء المحتملين';
        this.cdr.markForCheck();
        console.error('Failed loading leads', err);
        this.toastService.error('فشل تحميل العملاء المحتملين', this.getErrorMessage(err));
      },
    });
  }

  private loadStats() {
    this.potentialCustomerCenterService.getStats().subscribe({
      next: (res) => {
        if (res?.data?.statistics) {
          this.stats = res.data.statistics;
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        console.error('Failed loading lead stats', err);
        this.toastService.error('فشل تحميل الإحصائيات', this.getErrorMessage(err));
      },
    });
  }

  setUnderImplementationStatus(statusKey: string): void {
    this.loadLeads(statusKey);
  }

  setPotentialDataFilter(filter: 'all' | 'complete_data'): void {
    this.potentialDataFilter = filter;
    this.loadLeads();
  }

  private mapLeadToCustomer(lead: Lead): Customer {
    const style = STATUS_STYLE_MAP[lead.status] ?? DEFAULT_STATUS_STYLE;
    const dateSource = lead.claimed_at ?? lead.created_at;

    return {
      id: lead.id,
      name: lead.name,
      avatarUrl: DEFAULT_AVATAR,
      status: lead.status_label,
      statusColor: style.color,
      statusBgColor: style.bgColor,
      city: lead.city,
      country: lead.governorate,
      acceptedDate: this.formatArabicDate(dateSource),
      phone: lead.phone,
      assignedEmployee: lead.assigned_employee?.name ?? 'غير معين',
      notes: lead.notes,
      // Drives which items appear in the card's three-dots menu (assign, archive)
      actions: lead.actions,
    };
  }

  private formatArabicDate(isoLikeDate: string): string {
    const date = new Date(isoLikeDate.replace(' ', 'T'));
    if (isNaN(date.getTime())) return '';
    const datePart = new Intl.DateTimeFormat('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
    const timePart = new Intl.DateTimeFormat('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
    return `${datePart} ، ${timePart}`;
  }

  copyToClipboard(phone: string) {
    navigator.clipboard.writeText(phone).then(
      () => this.toastService.success('تم النسخ', 'تم نسخ رقم الهاتف بنجاح'),
      () => this.toastService.error('فشل النسخ', 'تعذر نسخ رقم الهاتف'),
    );
  }

  onChangeStatus(customerId: number) {
    const customer = this.currentCustomers.find((c) => c.id === customerId);

    const dialogRef = this.dialogService.open(ChangeStatusDialog, {
      header: 'تغيير حالة العميل',
      width: '480px',
      modal: true,
      closable: true,
      data: {
        customerId,
        customerName: customer?.name,
      },
    });

    dialogRef?.onClose.subscribe((result) => {
      if (result?.success && result?.data) {
        this.potentialCustomerCenterService.changeLeadStatus(customerId, result.data).subscribe({
          next: () => {
            // Refresh the leads list after status change
            this.toastService.success('تم التحديث', 'تم تغيير حالة العميل بنجاح');
            this.loadLeads();
            this.loadStats();
          },
          error: (err) => {
            console.error('Failed to change status:', err);
            this.toastService.error('فشل تغيير الحالة', this.getErrorMessage(err));
          },
        });
      }
    });
  }

  onDeleteCustomer(customerId: number) {
    this.potentialCustomerCenterService.deleteLead(customerId).subscribe({
      next: () => {
        // Refresh the leads list after deletion
        this.toastService.success('تم الحذف', 'تم حذف العميل بنجاح');
        this.loadLeads();
        this.loadStats();
      },
      error: (err) => {
        console.error('Failed to delete lead:', err);
        this.toastService.error('فشل حذف العميل', this.getErrorMessage(err));
      },
    });
  }

  onArchiveCustomer(customerId: number) {
    this.potentialCustomerCenterService.archiveLead(customerId).subscribe({
      next: () => {
        this.toastService.success('تمت الأرشفة', 'تمت أرشفة العميل بنجاح');
        this.loadLeads();
        this.loadStats();
      },
      error: (err) => {
        console.error('Failed to archive lead:', err);
        this.toastService.error('فشل أرشفة العميل', this.getErrorMessage(err));
      },
    });
  }

  // Opens the employee picker. The dialog calls POST /admin/leads/{id}/assign itself
  // and shows its own success / error toast, so here we only refresh on success.
  onAssignEmployee(customerId: number) {
    this.ref = this.dialogService.open(AssignEmployeeDialog, {
      header: 'تعيين مسؤول',
      width: '420px',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: { leadId: customerId },
    });

    this.ref!.onClose.subscribe((result) => {
      if (result?.success) {
        this.loadLeads();
        this.loadStats();
      }
    });
  }

  onWhatsappContact(customerId: number) {
    const customer = this.currentCustomers.find((c) => c.id === customerId);
    if (customer) {
      window.open(`https://wa.me/${customer.phone.replace(/[^0-9]/g, '')}`, '_blank');
    }
  }

  onPhoneCall(customerId: number) {
    const customer = this.currentCustomers.find((c) => c.id === customerId);
    if (customer) {
      window.location.href = `tel:${customer.phone}`;
    }
  }

  switchTab(tab: 'potential' | 'underImplementation') {
    this.activeTab = tab;
    this.loadLeads();
  }

  onActionButtonClick(event: MouseEvent, menu: Menu): void {
    menu.toggle(event);
  }

  onAcceptCustomer(customerId: number) {
    this.potentialCustomerCenterService.claimLead(customerId).subscribe({
      next: () => {
        this.toastService.success('تم الاستلام', 'تم استلام العميل بنجاح');
        this.loadLeads();
        this.loadStats();
      },
      error: (err) => {
        console.error('Failed to claim lead:', err);
        this.toastService.error('فشل استلام العميل', this.getErrorMessage(err));
      },
    });
  }

  private getErrorMessage(error: unknown): string {
    const errorResponse =
      this.isRecord(error) && this.isRecord(error['error'])
        ? error['error']
        : this.isRecord(error)
          ? error
          : {};
    const fieldErrors = errorResponse['errors'];

    if (this.isRecord(fieldErrors)) {
      const messages = Object.values(fieldErrors).flatMap((value) =>
        Array.isArray(value)
          ? value.filter((message): message is string => typeof message === 'string')
          : typeof value === 'string'
            ? [value]
            : [],
      );

      if (messages.length > 0) return messages.join(' ');
    }

    return typeof errorResponse['message'] === 'string'
      ? errorResponse['message']
      : 'حدث خطأ، يرجى المحاولة مرة أخرى';
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null;
  }

  showAddPotentialCustomerDialog() {
    this.ref = this.dialogService.open(AddPotentialCustomerDialog, {
      header: 'إضافة عميل محتمل',
      width: '520px',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        userId: 123,
        context: 'addPotentialCustomer',
      },
    });

    this.ref!.onClose.subscribe((result) => {
      if (result) {
        this.handleDialogResult(result);
      }
    });
  }

  showEditPotentialCustomerDialog(customerId: number) {
    const lead = this.rawLeads.find((l) => l.id === customerId);
    if (!lead) {
      console.error('Could not find lead to edit:', customerId);
      return;
    }

    this.ref = this.dialogService.open(EditPotentialCustomerDialog, {
      header: 'تعديل بيانات العميل',
      width: '520px',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: { lead },
    });

    this.ref!.onClose.subscribe((result) => {
      if (result) {
        this.handleDialogResult(result);
      }
    });
  }

  showAddCustomerGroupDialog() {
    this.ref = this.dialogService.open(AddCustomerGroupDialog, {
      header: 'إضافة مجموعة عملاء',
      width: '420px',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });

    this.ref!.onClose.subscribe((result) => {
      if (result?.success) {
        this.loadLeads();
        this.loadStats();
      }
    });
  }

  openArchive(): void {
    console.log('Open archive');
  }

  handleDialogResult(result: any) {
    if (result && result.success) {
      this.loadLeads();
      this.loadStats();
    }
  }
}
