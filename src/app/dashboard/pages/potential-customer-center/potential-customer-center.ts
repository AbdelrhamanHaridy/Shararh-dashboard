import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { Menu } from 'primeng/menu';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SharedKpiCard } from '../../shared/components/shared-kpi-card/shared-kpi-card';
import { CustomerCard, Customer } from './components/customer-card/customer-card';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { AddCustomerGroupDialog } from './components/add-customer-group-dialog/add-customer-group-dialog';
import { AddPotentialCustomerDialog } from './components/add-potential-customer-dialog/add-potential-customer-dialog';
import { ChangeStatusDialog } from './components/change-status-dialog/change-status-dialog';
import { Lead, LeadStatistics } from './models/potential-customer-center.model';
import { PotentialCustomerCenterService } from './services/potential-customer-center.service';
import { EditPotentialCustomerDialog } from './components/edit-potential-customer-dialog/edit-potential-customer-dialog';

// Which lead statuses belong to which tab.
// Update this once the real "under implementation" status keys are confirmed —
// the sample payload only contained new/interested/contacted.
const STATUS_TAB_MAP: Record<string, 'potential' | 'underImplementation'> = {
  new: 'potential',
  interested: 'potential',
  contacted: 'potential',
  subscribed: 'underImplementation',
  in_implementation: 'underImplementation',
};

// ASSUMPTION: backend "tab" query value per UI tab — adjust if the API expects
// different strings (sample payload only showed an empty "tab": "").
const TAB_PARAM_MAP: Record<'potential' | 'underImplementation', string> = {
  potential: 'potential',
  underImplementation: 'under_implementation',
};

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
  imports: [SharedKpiCard, PageHeaderComponent, CustomerCard, MenuModule],
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

  ref: DynamicDialogRef | null = null;
  private rawLeads: Lead[] = [];
  isLoadingLeads = false;
  loadError = '';

  // Status filter
  statuses = [
    { key: '', label: 'الكل' },
    { key: 'new', label: 'جديد' },
    { key: 'contacted', label: 'تم التواصل' },
    { key: 'interested', label: 'مهتم' },
    { key: 'subscribed', label: 'مشترك' },
    { key: 'rejected', label: 'مرفوض' },
  ];
  selectedStatus = '';

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
  ) {}

  ngOnInit() {
    this.loadLeads();
    this.loadStats();

    this.searchSub = this.searchInput$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((term) => {
        this.searchTerm = term;
        this.loadLeads();
      });
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
      this.selectedStatus = status;
    }

    // filters['tab'] = TAB_PARAM_MAP[this.activeTab];
    if (this.selectedStatus) filters['status'] = this.selectedStatus;
    if (this.searchTerm) filters['search'] = this.searchTerm;

    this.potentialCustomerCenterService.getLeads(filters).subscribe({
      next: (res) => {
        if (res && Array.isArray(res.data)) {
          this.rawLeads = res.data;
          const mapped = res.data.map((lead) => this.mapLeadToCustomer(lead));
          this.potentialCustomers = mapped.filter(
            (_, i) => this.resolveTab(res.data[i].status) === 'potential',
          );
          this.underImplementationCustomers = mapped.filter(
            (_, i) => this.resolveTab(res.data[i].status) === 'underImplementation',
          );
        }
        this.isLoadingLeads = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoadingLeads = false;
        this.loadError = 'تعذر تحميل بيانات العملاء المحتملين';
        this.cdr.markForCheck();
        console.error('Failed loading leads', err);
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
      error: (err) => console.error('Failed loading lead stats', err),
    });
  }

  setStatusFilter(statusKey: string) {
    this.loadLeads(statusKey);
  }

  private resolveTab(status: string): 'potential' | 'underImplementation' {
    return STATUS_TAB_MAP[status] ?? 'potential';
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
    navigator.clipboard.writeText(phone).then(() => {
      // alert('تم نسخ رقم الهاتف بنجاح');
    });
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
            this.loadLeads();
            this.loadStats();
          },
          error: (err) => {
            console.error('Failed to change status:', err);
            alert('فشل تغيير الحالة. حاول مرة أخرى.');
          },
        });
      }
    });
  }

  onDeleteCustomer(customerId: number) {
    this.potentialCustomerCenterService.deleteLead(customerId).subscribe({
      next: () => {
        // Refresh the leads list after deletion
        this.loadLeads();
        this.loadStats();
      },
      error: (err) => {
        console.error('Failed to delete lead:', err);
        alert('فشل حذف العميل. حاول مرة أخرى.');
      },
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
    console.log('Accept customer:', customerId);
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
      width: '520px',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
      data: {
        userId: 123,
        context: 'addCustomerGroup',
      },
    });

    this.ref!.onClose.subscribe((result) => {
      if (result) {
        this.handleDialogResult(result);
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
