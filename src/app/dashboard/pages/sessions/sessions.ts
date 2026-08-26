import { Component, inject, OnInit, signal } from '@angular/core';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { SharedKpiCard } from '../../shared/components/shared-kpi-card/shared-kpi-card';
import { SharedSelectComponent } from '../../shared/components/shared-select/shared-select.component';
import { SharedTableComponent } from '../../shared/components/shared-table/shared-table.component';
import { Router } from '@angular/router';
import { SessionsService } from './services/sessions.service';
import { ApiSession, SessionRow } from './models/session.model';

@Component({
  selector: 'app-sessions',
  imports: [PageHeaderComponent, SharedKpiCard, SharedSelectComponent, SharedTableComponent],
  templateUrl: './sessions.html',
  styleUrl: './sessions.scss',
})
export class Sessions implements OnInit {
  private readonly router = inject(Router);
  private readonly sessionsService = inject(SessionsService);

  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };
  breadcrumbItems: MenuItem[] = [{ label: 'الجلسات', routerLink: '/sessions' }];

  contactViaOptions = [
    { label: 'هاتف', value: 'phone' },
    { label: 'بريد الكتروني', value: 'email' },
    { label: 'واتس اب', value: 'whatsapp' },
    { label: 'الموقع المجاني', value: 'website' },
  ];

  columns = [
    { field: 'employeeName', header: 'اسم الموظف' },
    { field: 'startTime', header: 'وقت البدء' },
    { field: 'endTime', header: 'وقت الانتهاء' },
    {
      field: 'duration',
      header: 'المدة',
      style: { fontWeight: 'bold', color: '#191C19', fontSize: '16px' },
    },
    { field: 'status', header: 'حالة الجلسة' },
    { field: 'rating', header: 'التقييم' },
    {
      field: 'operations',
      header: 'العمليات',
      style: { fontWeight: 'bold', color: '#191C19', fontSize: '16px' },
    },
    { field: 'actions', header: '' },
  ];

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  sessions = signal<SessionRow[]>([]);
  totalSessions = signal(0);
  currentPage = signal(1);

  sessionsToday = signal(0);
  totalPointsToday = signal(0);
  communicationsToday = signal(0);
  averageSessionDuration = signal('00:00');

  ngOnInit(): void {
    this.fetchSessions();
  }

  fetchSessions(page: number = 1): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.sessionsService.getAdminSessions({ page }).subscribe({
      next: (res) => {
        const payload = res.data;

        this.sessionsToday.set(payload.sessions_today);
        this.totalPointsToday.set(payload.total_points_today);
        this.communicationsToday.set(payload.communications_today);
        this.averageSessionDuration.set(payload.average_session_duration);

        this.sessions.set(payload.data.data.map((s) => this.mapSession(s)));
        this.totalSessions.set(payload.data.total);
        this.currentPage.set(payload.data.current_page);

        this.isLoading.set(false);
      },
      error: (error) => {
        this.isLoading.set(false);
        this.errorMessage.set(
          error?.error?.message || 'حدث خطأ أثناء تحميل الجلسات، حاول مرة أخرى',
        );
      },
    });
  }

  onPageChange(page: number): void {
    this.fetchSessions(page);
  }

  private mapSession(s: ApiSession): SessionRow {
    const started = s.started_at ? new Date(s.started_at) : null;
    const ended = s.ended_at ? new Date(s.ended_at) : null;

    return {
      id: s.id,
      avatarUrl: s.user.avatar || 'assets/testing/avatar.png',
      employeeName: s.user.name,
      jobTitle: s.user.job_title,
      startTime: started ? this.formatTime(started) : '-',
      startDate: started ? this.formatDate(started) : '-',
      endTime: ended ? this.formatTime(ended) : '-',
      endDate: ended ? this.formatDate(ended) : '-',
      duration: this.formatDuration(s.duration, s.status),
      status: s.status,
      rating: s.rating_label ?? '-',
      operations: s.operations_count,
    };
  }

  private formatDuration(duration: string | null, status: string): string {
    if (status === 'active') return 'جارية';
    if (!duration) return '-';

    const [hh, mm] = duration.split(':');
    const hours = parseInt(hh, 10);
    const minutes = parseInt(mm, 10);

    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;
  }

  private formatTime(date: Date): string {
    return new Intl.DateTimeFormat('ar-EG', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    }).format(date);
  }

  private formatDate(date: Date): string {
    return new Intl.DateTimeFormat('ar-EG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  onSessionRowClick(row: SessionRow): void {
    this.router.navigate(['/sessions/session-details', row.id]);
  }
}
