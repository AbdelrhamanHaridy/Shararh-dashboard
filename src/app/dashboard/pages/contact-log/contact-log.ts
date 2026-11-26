import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  ValidatorFn,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DatePickerModule } from 'primeng/datepicker';
import { PaginatorModule } from 'primeng/paginator';
import { SharedSelectComponent } from '../../shared/components/shared-select/shared-select.component';
import { SharedTextInputComponent } from '../../shared/components/shared-text-input/shared-text-input.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { ContactLogService } from './services/contact-log.service';
import {
  Communication,
  CommunicationFilters,
  OptionItem,
  CreateCommunicationPayload,
  CommunicationReasonContext,
} from './models/communications.model';
import { PotentialCustomerCenterService } from '../potential-customer-center/services/potential-customer-center.service';
import { ToastService } from '../../shared/services/toast.service';

interface ContactLogEntry {
  id: number;
  name: string;
  time: string;
  timeAgo: string;
  direction: 'صادر' | 'وارد';
  contactType: string;
  reason: string;
  icon: string;
  iconBgColor: string;
  borderColor: string;
}

interface ContactLogDay {
  day: string;
  entries: ContactLogEntry[];
}

interface SuggestedTaskView {
  id: number;
  title: string;
}

interface EmployeeFilterOption {
  label: string;
  value: number | 'all';
}

const COMMUNICATION_TYPE_LABELS: Record<string, string> = {
  outgoing: 'صادر',
  incoming: 'وارد / مستلم',
  صادر: 'صادر',
  وارد: 'وارد / مستلم',
  مستلم: 'وارد / مستلم',
};

const REQUIRED_LEAD_SELECTION: ValidatorFn = (control) =>
  typeof control.value === 'number' && Number.isInteger(control.value) && control.value > 0
    ? null
    : { required: true };

@Component({
  selector: 'app-contact-log',
  imports: [
    SharedTextInputComponent,
    SharedSelectComponent,
    ReactiveFormsModule,
    ToggleSwitchModule,
    DatePickerModule,
    PaginatorModule,
    CommonModule,
    PageHeaderComponent,
  ],
  templateUrl: './contact-log.html',
  styleUrl: './contact-log.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactLog implements OnInit, OnDestroy {
  contactForm!: FormGroup;
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };

  breadcrumbItems: MenuItem[] = [{ label: 'سجل الاتصال', routerLink: '/contact-log' }];

  // Types and channels come from /options; reasons are fetched for the selected lead and type.
  contactTypeOptions: OptionItem[] = [];
  contactViaOptions: OptionItem[] = [];
  communicationTypeFilterOptions: OptionItem[] = [];
  communicationChannelFilterOptions: OptionItem[] = [];
  employeeFilterOptions: EmployeeFilterOption[] = [];
  canFilterByEmployee = false;
  isLoadingEmployeeFilterOptions = true;
  employeeFilterError = '';
  contactReasonOptions: OptionItem[] = [];
  isLoadingContactReasons = false;
  contactReasonPlaceholder = 'اختر العميل أو نوعه ونوع التواصل أولاً';
  contactReasonError = '';
  leadsOptions: { label: string; value: number | 'none' }[] = [
    { label: 'بدون تحديد عميل', value: 'none' },
  ];
  readonly customerTypeOptions: OptionItem[] = [
    { key: 'potential', value: 'potential', label: 'محتمل' },
    { key: 'registered', value: 'registered', label: 'مسجل' },
  ];
  hasSelectedLead = false;
  private reasonRequest?: Subscription;
  private communicationsRequest?: Subscription;
  private filterChangeSubscription?: Subscription;

  // Populated from GET /admin/lead-communications/suggested-tasks
  taskStats = {
    total: 0,
    completed: 0,
    progress: 0,
  };

  suggestedTasks: SuggestedTaskView[] = [];

  contactLogDays: ContactLogDay[] = [];
  communicationFilterForm!: FormGroup;
  currentCommunicationsPage = 1;
  lastCommunicationsPage = 1;
  totalCommunications = 0;
  isLoadingCommunications = false;
  communicationsError = '';
  showCommunicationFilters = true;

  constructor(
    private fb: FormBuilder,
    private contactLogService: ContactLogService,
    private potentialCustomerService: PotentialCustomerCenterService,
    private cdr: ChangeDetectorRef,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.contactForm = this.fb.group({
      leadId: ['none', REQUIRED_LEAD_SELECTION],
      customerType: ['', Validators.required],
      contactType: ['', Validators.required],
      contactVia: ['', Validators.required],
      contactReason: [{ value: '', disabled: true }, Validators.required],
      notes: [''],
      nextFollowUpAt: [''],
    });
    this.communicationFilterForm = this.fb.group({
      communicationType: ['all'],
      communicationChannel: ['all'],
      employeeId: ['all'],
      dateRange: [null as Date[] | null],
    });
    this.filterChangeSubscription = this.communicationFilterForm.valueChanges.subscribe(() => {
      this.currentCommunicationsPage = 1;
      this.loadCommunications();
    });

    this.loadLeads();
    this.loadOptions();
    this.loadEmployeeFilterOptions();
    this.loadSuggestedTasks();
    this.loadCommunications();
  }

  ngOnDestroy(): void {
    this.reasonRequest?.unsubscribe();
    this.communicationsRequest?.unsubscribe();
    this.filterChangeSubscription?.unsubscribe();
  }

  onReasonContextChanged(): void {
    this.loadCommunicationReasons();
  }

  onLeadSelectionChanged(): void {
    const selectedLeadId = this.contactForm.controls['leadId'].value;
    this.hasSelectedLead =
      typeof selectedLeadId === 'number' && Number.isInteger(selectedLeadId) && selectedLeadId > 0;

    const customerTypeControl = this.contactForm.controls['customerType'];
    if (this.hasSelectedLead) {
      customerTypeControl.reset('', { emitEvent: false });
      customerTypeControl.disable({ emitEvent: false });
    } else {
      customerTypeControl.enable({ emitEvent: false });
    }

    this.loadCommunicationReasons();
    this.cdr.markForCheck();
  }

  onSubmit() {
    if (
      this.contactForm.invalid ||
      this.isLoadingContactReasons ||
      this.contactReasonOptions.length === 0 ||
      !this.hasSelectedLead
    ) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const formValue = this.contactForm.value;
    const leadId = this.contactForm.controls['leadId'].value;
    if (typeof leadId !== 'number') {
      return;
    }

    const payload: CreateCommunicationPayload = {
      communication_type: formValue.contactType,
      communication_channel: formValue.contactVia,
      communication_reason: formValue.contactReason,
      notes: formValue.notes || undefined,
      lead_id: leadId,
    };
    const nextFollowUpAt = formValue.nextFollowUpAt;
    if (typeof nextFollowUpAt === 'string' && nextFollowUpAt.length > 0) {
      payload.next_follow_up_at = `${nextFollowUpAt.replace('T', ' ')}:00`;
    }

    this.contactLogService.addCommunication(payload).subscribe({
      next: () => {
        this.contactForm.reset({
          leadId: 'none',
          customerType: '',
          contactType: '',
          contactVia: '',
          contactReason: '',
          notes: '',
          nextFollowUpAt: '',
        });
        this.onLeadSelectionChanged();
        this.toastService.success('تمت الإضافة', 'تم تسجيل الاتصال بنجاح');
        // Refresh the timeline and suggested tasks after a successful submission
        this.currentCommunicationsPage = 1;
        this.loadCommunications();
        this.loadSuggestedTasks();
      },
      error: (err) => {
        console.error('Failed to add communication', err);
        this.toastService.error('فشل تسجيل الاتصال', this.getErrorMessage(err));
      },
    });
  }

  private loadOptions() {
    this.contactLogService.getOptions().subscribe({
      next: (res) => {
        if (res?.data) {
          this.contactTypeOptions = (res.data.communication_types ?? []).map((option) => {
            const valueKey = option.value.trim().toLowerCase();
            const optionKey = option.key.trim().toLowerCase();

            return {
              ...option,
              label:
                COMMUNICATION_TYPE_LABELS[valueKey] ??
                COMMUNICATION_TYPE_LABELS[optionKey] ??
                option.label,
            };
          });
          this.contactViaOptions = res.data.communication_channels ?? [];
          this.communicationTypeFilterOptions = [
            { key: 'all', value: 'all', label: 'كل الأنواع' },
            ...this.contactTypeOptions,
          ];
          this.communicationChannelFilterOptions = [
            { key: 'all', value: 'all', label: 'كل القنوات' },
            ...this.contactViaOptions,
          ];
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        console.error('Failed loading contact-log options', err);
        this.toastService.error('فشل تحميل خيارات الاتصال', this.getErrorMessage(err));
      },
    });
  }

  private loadCommunicationReasons(): void {
    this.reasonRequest?.unsubscribe();
    this.contactReasonOptions = [];
    this.contactReasonError = '';
    this.contactReasonPlaceholder = 'اختر العميل أو نوعه ونوع التواصل أولاً';
    this.contactForm.controls['contactReason'].disable({ emitEvent: false });
    this.contactForm.controls['contactReason'].reset('', { emitEvent: false });

    const communicationType = this.contactForm.controls['contactType'].value;
    const selectedLeadId = this.contactForm.controls['leadId'].value;
    const leadId = typeof selectedLeadId === 'number' ? selectedLeadId : null;
    const selectedCustomerType = this.contactForm.controls['customerType'].value;
    let context: CommunicationReasonContext | null = null;
    if (leadId !== null && leadId > 0) {
      context = { kind: 'lead', leadId };
    } else if (selectedCustomerType === 'potential' || selectedCustomerType === 'registered') {
      context = { kind: 'customerType', customerType: selectedCustomerType };
    }

    if (
      typeof communicationType !== 'string' ||
      communicationType.length === 0 ||
      context === null
    ) {
      this.isLoadingContactReasons = false;
      this.cdr.markForCheck();
      return;
    }

    this.isLoadingContactReasons = true;
    this.contactReasonPlaceholder = 'جاري تحميل الأسباب...';
    this.cdr.markForCheck();
    this.reasonRequest = this.contactLogService
      .getCommunicationReasons(communicationType, context)
      .subscribe({
        next: (response) => {
          this.contactReasonOptions = response.data.reasons;
          this.isLoadingContactReasons = false;
          this.contactReasonPlaceholder = 'اختر سبب التواصل';
          if (this.contactReasonOptions.length > 0) {
            this.contactForm.controls['contactReason'].enable({ emitEvent: false });
          }
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Failed loading communication reasons:', error);
          this.contactReasonError = 'تعذر تحميل أسباب التواصل';
          this.isLoadingContactReasons = false;
          this.contactReasonPlaceholder = 'تعذر تحميل الأسباب';
          this.toastService.error('فشل تحميل أسباب التواصل', this.getErrorMessage(error));
          this.cdr.markForCheck();
        },
      });
  }

  private loadSuggestedTasks() {
    this.contactLogService.getSuggestedTasks().subscribe({
      next: (res) => {
        if (res?.data) {
          this.taskStats = {
            total: res.data.total_tasks,
            completed: res.data.completed_tasks,
            progress: res.data.completion_percentage,
          };
          this.suggestedTasks = (res.data.tasks ?? [])
            .filter((t) => t.is_active)
            .map((t) => ({ id: t.id, title: t.title_ar || t.title }));
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        console.error('Failed loading suggested tasks', err);
        this.toastService.error('فشل تحميل المهام المقترحة', this.getErrorMessage(err));
      },
    });
  }

  private loadCommunications() {
    const filterValues = this.communicationFilterForm.getRawValue();
    const filters: CommunicationFilters = {
      page: this.currentCommunicationsPage,
      per_page: 15,
    };

    if (filterValues.communicationType !== 'all') {
      filters.communication_type = filterValues.communicationType;
    }
    if (filterValues.communicationChannel !== 'all') {
      filters.communication_channel = filterValues.communicationChannel;
    }
    if (this.canFilterByEmployee && typeof filterValues.employeeId === 'number') {
      filters.employee_id = filterValues.employeeId;
    }
    const dateRange = filterValues.dateRange;
    if (Array.isArray(dateRange)) {
      const dateFrom = dateRange[0];
      const dateTo = dateRange[1];
      if (dateFrom instanceof Date && Number.isFinite(dateFrom.getTime())) {
        filters.date_from = this.formatDateFilter(dateFrom);
      }
      if (dateTo instanceof Date && Number.isFinite(dateTo.getTime())) {
        filters.date_to = this.formatDateFilter(dateTo);
      }
    }

    this.communicationsRequest?.unsubscribe();
    this.isLoadingCommunications = true;
    this.communicationsError = '';
    this.communicationsRequest = this.contactLogService.getCommunications(filters).subscribe({
      next: (res) => {
        if (res && Array.isArray(res.data)) {
          this.contactLogDays = this.groupCommunicationsByDay(res.data);
        }
        this.currentCommunicationsPage = res.pagination.current_page;
        this.lastCommunicationsPage = res.pagination.last_page;
        this.totalCommunications = res.pagination.total;
        this.isLoadingCommunications = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Failed loading communications', err);
        this.communicationsError = this.getErrorMessage(err);
        this.isLoadingCommunications = false;
        this.toastService.error('فشل تحميل سجل الاتصالات', this.getErrorMessage(err));
        this.cdr.markForCheck();
      },
    });
  }

  private loadEmployeeFilterOptions(): void {
    this.potentialCustomerService.getLeadEmployees().subscribe({
      next: (response) => {
        this.canFilterByEmployee = response.data.can_filter_all;
        if (this.canFilterByEmployee) {
          this.employeeFilterOptions = [
            { label: 'كل الموظفين', value: 'all' },
            ...response.data.employees.map((employee) => ({
              label: employee.name,
              value: employee.id,
            })),
          ];
        }
        this.isLoadingEmployeeFilterOptions = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Failed loading employee filter options', error);
        this.employeeFilterError = 'تعذر تحميل قائمة الموظفين';
        this.isLoadingEmployeeFilterOptions = false;
        this.toastService.error('فشل تحميل الموظفين', this.getErrorMessage(error));
        this.cdr.markForCheck();
      },
    });
  }

  goToCommunicationsPage(page: number): void {
    if (page < 1 || page > this.lastCommunicationsPage || page === this.currentCommunicationsPage) {
      return;
    }
    this.currentCommunicationsPage = page;
    this.loadCommunications();
  }

  onCommunicationsPageChange(event: { page?: number | null }): void {
    if (typeof event.page === 'number') {
      this.goToCommunicationsPage(event.page + 1);
    }
  }

  toggleCommunicationFilters(): void {
    this.showCommunicationFilters = !this.showCommunicationFilters;
  }

  clearCommunicationFilters(): void {
    this.communicationFilterForm.reset({
      communicationType: 'all',
      communicationChannel: 'all',
      employeeId: 'all',
      dateRange: null,
    });
  }

  private formatDateFilter(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private loadLeads() {
    this.potentialCustomerService.getLeads().subscribe({
      next: (res) => {
        if (res?.data && Array.isArray(res.data)) {
          this.leadsOptions = [
            { label: 'بدون تحديد عميل', value: 'none' },
            ...res.data.map((lead: any) => ({
              label: lead.name || lead.activity_name || '—',
              value: lead.id,
            })),
          ];
          console.log(this.leadsOptions);

          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        console.error('Failed loading leads', err);
        this.toastService.error('فشل تحميل العملاء المحتملين', this.getErrorMessage(err));
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

  private groupCommunicationsByDay(items: Communication[]): ContactLogDay[] {
    const map = new Map<string, ContactLogEntry[]>();

    for (const c of items) {
      const date = new Date(c.created_at);
      const key = date.toDateString();
      const name =
        c.lead?.name ||
        `${c.employee?.first_name || ''} ${c.employee?.last_name || ''}`.trim() ||
        '—';
      const time = date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
      const timeAgo = this.relativeTime(date);
      const direction: 'صادر' | 'وارد' = c.employee ? 'صادر' : 'وارد';
      const contactType =
        c.communication_channel_label ||
        c.communication_channel ||
        c.communication_type_label ||
        c.communication_type;
      const reason = c.communication_reason_label || c.communication_reason || '';

      const channel = (c.communication_channel || '').toLowerCase();
      let icon = 'pi pi-phone';
      let color = '#176B8A';
      if (channel.includes('whatsapp')) {
        icon = 'assets/icons/global/whatsapp.svg';
        color = '#10A922';
      } else if (channel.includes('phone')) {
        icon = 'assets/icons/global/phone.svg';
        color = '#308FEE';
      } else if (channel.includes('email')) {
        icon = 'pi pi-envelope';
        color = '#308FEE';
      } else if (channel.includes('sms')) {
        icon = 'pi pi-comments';
        color = '#8A97A8';
      }

      const entry: ContactLogEntry = {
        id: c.id,
        name,
        time,
        timeAgo,
        direction,
        contactType,
        reason,
        icon,
        iconBgColor: color,
        borderColor: color,
      };

      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(entry);
    }

    const days: ContactLogDay[] = [];
    for (const [key, entries] of Array.from(map.entries()).sort(
      (a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime(),
    )) {
      const date = new Date(key);
      days.push({ day: this.formatDayLabel(date), entries });
    }

    return days;
  }

  private formatDayLabel(date: Date): string {
    const today = new Date();
    const diff = Math.floor(
      (today.setHours(0, 0, 0, 0) - new Date(date).setHours(0, 0, 0, 0)) / 86400000,
    );
    if (diff === 0) return 'اليوم';
    if (diff === 1) return 'امس';
    return new Intl.DateTimeFormat('ar-SA', { day: 'numeric', month: 'long' }).format(date);
  }

  private relativeTime(date: Date): string {
    const diffMs = Date.now() - date.getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return 'الآن';
    if (mins < 60) return `قبل ${mins} دقيقة`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `قبل ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `قبل ${days} يوم`;
  }
}
