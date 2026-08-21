import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';
import { PageHeaderComponent } from '../../../../shared/components/page-header/page-header.component';
import { CustomerCard } from '../../../potential-customer-center/components/customer-card/customer-card';
import { PotentialCustomerCenterService } from '../../../potential-customer-center/services/potential-customer-center.service';
import { Lead } from '../../../potential-customer-center/models/potential-customer-center.model';

interface Customer {
  id: number;
  name: string;
  avatarUrl: string;
  status: string;
  statusColor: string;
  statusBgColor: string;
  city: string;
  country: string;
  acceptedDate: string;
  phone: string;
  assignedEmployee: string;
  notes: string;
}

const STATUS_STYLE_MAP: Record<string, { color: string; bgColor: string }> = {
  new: { color: '#137FEC', bgColor: '#E3F2FD' },
  interested: { color: '#B4630D', bgColor: '#FFEDC3' },
  contacted: { color: '#B4630D', bgColor: '#FFEDC3' },
  subscribed: { color: '#10A922', bgColor: '#DCFCE7' },
  in_implementation: { color: '#137FEC', bgColor: '#E3F2FD' },
  rejected: { color: '#D22F27', bgColor: '#FDE2E1' },
};
const DEFAULT_STATUS_STYLE = { color: '#8A97A8', bgColor: '#F1F5F9' };
const DEFAULT_AVATAR = 'assets/testing/avatar.png';
const STATUS_LABELS: Record<string, string> = {
  new: 'جديد',
  contacted: 'تم التواصل',
  interested: 'مهتم',
  subscribed: 'مشترك',
  rejected: 'مرفوض',
  in_implementation: 'تحت التنفيذ',
};

@Component({
  selector: 'app-archive-potential-customer-center',
  imports: [PageHeaderComponent, CustomerCard],
  templateUrl: './archive-potential-customer-center.html',
  styleUrl: './archive-potential-customer-center.scss',
})
export class ArchivePotentialCustomerCenter implements OnInit, OnDestroy {
  constructor(
    private potentialCustomerService: PotentialCustomerCenterService,
    private cdr: ChangeDetectorRef,
  ) {}

  isLoading = false;
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };
  breadcrumbItems = [{ label: 'مركز العملاء المحتملين' }];

  activeTab: 'potential' | 'underImplementation' = 'potential';

  statuses = [
    { key: '', label: 'الكل' },
    { key: 'new', label: 'جديد' },
    { key: 'contacted', label: 'تم التواصل' },
    { key: 'interested', label: 'مهتم' },
    { key: 'subscribed', label: 'مشترك' },
    { key: 'rejected', label: 'مرفوض' },
  ];
  selectedStatus = '';
  searchTerm = '';
  private searchInput$ = new Subject<string>();
  private searchSub?: Subscription;
  loadError = '';

  potentialCustomers: Customer[] = [];
  underImplementationCustomers: Customer[] = [];

  ngOnInit(): void {
    this.loadArchivedLeads();
    this.searchSub = this.searchInput$
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((term) => {
        this.searchTerm = term;
        this.loadArchivedLeads();
      });
  }

  ngOnDestroy(): void {
    this.searchSub?.unsubscribe();
  }

  private loadArchivedLeads(status?: string): void {
    this.isLoading = true;
    this.loadError = '';
    if (status !== undefined) {
      this.selectedStatus = status;
    }

    const filters: Record<string, string> = {};
    if (this.selectedStatus) filters['status'] = this.selectedStatus;
    if (this.searchTerm) filters['search'] = this.searchTerm;

    this.potentialCustomerService.getArchivedLeads(filters).subscribe({
      next: (res) => {
        if (res && Array.isArray(res.data)) {
          this.potentialCustomers = res.data
            .map((lead) => this.mapLeadToCustomer(lead))
            .filter((_, index) => this.resolveTab(res.data[index].status) === 'potential');
          this.underImplementationCustomers = res.data
            .map((lead) => this.mapLeadToCustomer(lead))
            .filter(
              (_, index) => this.resolveTab(res.data[index].status) === 'underImplementation',
            );
        }
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed to load archived leads', err);
        this.loadError = 'تعذر تحميل بيانات العملاء المؤرشفة';
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onSearchInput(value: string): void {
    this.searchInput$.next(value);
  }

  setStatusFilter(statusKey: string): void {
    this.loadArchivedLeads(statusKey);
  }

  private resolveTab(status: string): 'potential' | 'underImplementation' {
    return ['subscribed', 'in_implementation'].includes(status)
      ? 'underImplementation'
      : 'potential';
  }

  private mapLeadToCustomer(lead: Lead): Customer {
    const style = STATUS_STYLE_MAP[lead.status] ?? DEFAULT_STATUS_STYLE;
    const dateSource = lead.claimed_at ?? lead.created_at;

    return {
      id: lead.id,
      name: lead.name,
      avatarUrl: DEFAULT_AVATAR,
      status: STATUS_LABELS[lead.status] ?? lead.status_label,
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
    if (isNaN(date.getTime())) return isoLikeDate;

    const formatter = new Intl.DateTimeFormat('ar-SA', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    return formatter.format(date);
  }

  get currentCustomers() {
    return this.activeTab === 'potential'
      ? this.potentialCustomers
      : this.underImplementationCustomers;
  }

  copyToClipboard(phone: string) {
    navigator.clipboard.writeText(phone).then(() => {
      // alert('تم نسخ رقم الهاتف بنجاح');
    });
  }

  onChangeStatus(customerId: number) {
    console.log('Change status for customer:', customerId);
    // Add status change logic here
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
  }

  onAcceptCustomer(customerId: number) {
    console.log('Accept customer:', customerId);
    // Add accept customer logic here
    // This could move the customer from potential to under implementation
  }
}
