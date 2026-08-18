import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { SharedSelectComponent } from '../../shared/components/shared-select/shared-select.component';
import { SharedTextInputComponent } from '../../shared/components/shared-text-input/shared-text-input.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { ContactLogService } from './services/contact-log.service';
import {
  Communication,
  OptionItem,
  CreateCommunicationPayload,
} from './models/communications.model';

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

@Component({
  selector: 'app-contact-log',
  imports: [
    SharedTextInputComponent,
    SharedSelectComponent,
    ReactiveFormsModule,
    ToggleSwitchModule,
    CommonModule,
    PageHeaderComponent,
  ],
  templateUrl: './contact-log.html',
  styleUrl: './contact-log.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactLog implements OnInit {
  contactForm!: FormGroup;
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };

  breadcrumbItems: MenuItem[] = [{ label: 'سجل الاتصال', routerLink: '/contact-log' }];

  // Populated from GET /admin/lead-communications/options
  contactTypeOptions: OptionItem[] = [];
  contactViaOptions: OptionItem[] = [];
  contactReasonOptions: OptionItem[] = [];
  usersOptions: { label: string; value: number }[] = [];

  // Populated from GET /admin/lead-communications/suggested-tasks
  taskStats = {
    total: 0,
    completed: 0,
    progress: 0,
  };

  suggestedTasks: SuggestedTaskView[] = [];

  contactLogDays: ContactLogDay[] = [];

  constructor(
    private fb: FormBuilder,
    private contactLogService: ContactLogService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.contactForm = this.fb.group({
      leadId: ['', Validators.required],
      contactType: ['', Validators.required],
      contactVia: ['', Validators.required],
      contactReason: ['', Validators.required],
      notes: [''],
    });

    this.loadUsers();
    this.loadOptions();
    this.loadSuggestedTasks();
    this.loadCommunications();
  }

  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    const formValue = this.contactForm.value;

    const payload: CreateCommunicationPayload = {
      communication_type: formValue.contactType,
      communication_channel: formValue.contactVia,
      communication_reason: formValue.contactReason,
      notes: formValue.notes || undefined,
      lead_id: Number(formValue.leadId),
    };

    this.contactLogService.addCommunication(payload).subscribe({
      next: () => {
        this.contactForm.reset();
        // Refresh the timeline and suggested tasks after a successful submission
        this.loadCommunications();
        this.loadSuggestedTasks();
      },
      error: (err) => console.error('Failed to add communication', err),
    });
  }

  private loadOptions() {
    this.contactLogService.getOptions().subscribe({
      next: (res) => {
        if (res?.data) {
          this.contactTypeOptions = res.data.communication_types ?? [];
          this.contactViaOptions = res.data.communication_channels ?? [];
          this.contactReasonOptions = res.data.communication_reasons ?? [];
          this.cdr.markForCheck();
        }
      },
      error: (err) => console.error('Failed loading contact-log options', err),
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
      error: (err) => console.error('Failed loading suggested tasks', err),
    });
  }

  private loadCommunications() {
    this.contactLogService.getCommunications().subscribe({
      next: (res) => {
        if (res && Array.isArray(res.data)) {
          this.contactLogDays = this.groupCommunicationsByDay(res.data);
          this.cdr.markForCheck();
        }
      },
      error: (err) => console.error('Failed loading communications', err),
    });
  }

  private loadUsers() {
    this.contactLogService.getUsers().subscribe({
      next: (res) => {
        if (res?.data && Array.isArray(res.data)) {
          this.usersOptions = res.data.map((user: any) => ({
            label: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
            value: user.id,
          }));
          this.cdr.markForCheck();
        }
      },
      error: (err) => console.error('Failed loading users', err),
    });
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
