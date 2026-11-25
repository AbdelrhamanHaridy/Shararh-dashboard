import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { MenuItem } from 'primeng/api';
import { Subject, catchError, of, switchMap } from 'rxjs';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import {
  ProgressBoardService,
  Employee,
  ProgressBoardData,
} from './progress-board.service';

@Component({
  selector: 'app-progress-board',
  imports: [CommonModule, FormsModule, DatePickerModule, PageHeaderComponent],
  templateUrl: './progress-board.html',
  styleUrl: './progress-board.scss',
})
export class ProgressBoard implements OnInit {
  private readonly progressBoardService = inject(ProgressBoardService);
  private readonly destroyRef = inject(DestroyRef);

  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };
  breadcrumbItems: MenuItem[] = [{ label: 'لوحة التقدم', routerLink: '/progress-board' }];

  // Podium slots in display order: [2nd, 1st, 3rd]. A slot is undefined when nobody holds it.
  topThree = signal<(Employee | undefined)[]>([]);
  rankedEmployees = signal<Employee[]>([]);
  description = signal<string>('');
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  // Monthly filter
  readonly today = new Date();
  selectedMonth = signal<Date | null>(null);
  periodLabel = signal<string>('');

  hasPodium = computed(() => this.topThree().some((e) => !!e));

  // "YYYY-MM", or null to let the backend use the current month
  private readonly period$ = new Subject<string | null>();

  ngOnInit(): void {
    this.period$
      .pipe(
        // switchMap cancels the previous request if the month changes quickly
        switchMap((period) => {
          this.isLoading.set(true);
          this.error.set(null);

          return this.progressBoardService.getProgressBoard(period).pipe(
            catchError((err) => {
              console.error('Failed to load progress board:', err);
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((response) => {
        this.isLoading.set(false);

        if (!response || !response.success || !response.data) {
          this.topThree.set([]);
          this.rankedEmployees.set([]);
          this.error.set('تعذر تحميل بيانات لوحة التقدم');
          return;
        }

        this.applyData(response.data);
      });

    // First load: current month (no period sent)
    this.period$.next(null);
  }

  onMonthChange(date: Date | null): void {
    this.selectedMonth.set(date);
    this.period$.next(date ? this.toPeriod(date) : null);
  }

  private applyData(data: ProgressBoardData): void {
    const top = data.top_performers.slice(0, 3);

    // Podium order: rank 2, rank 1, rank 3. Missing ranks stay undefined so positions don't shift.
    this.topThree.set([top[1], top[0], top[2]]);
    this.rankedEmployees.set(data.other_employees);
    this.description.set(data.description);

    this.periodLabel.set(data.period?.label ?? data.period_label ?? '');
    this.selectedMonth.set(new Date(data.selected_year, data.selected_month - 1, 1));
  }

  private toPeriod(date: Date): string {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${date.getFullYear()}-${month}`;
  }
}