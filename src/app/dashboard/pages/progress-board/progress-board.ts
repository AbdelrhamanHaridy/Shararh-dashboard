import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';
import { ProgressBoardService, Employee } from './progress-board.service';

@Component({
  selector: 'app-progress-board',
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './progress-board.html',
  styleUrl: './progress-board.scss',
})
export class ProgressBoard {
  private readonly progressBoardService = inject(ProgressBoardService);

  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };
  breadcrumbItems: MenuItem[] = [{ label: 'لوحة التقدم', routerLink: '/progress-board' }];

  topThree = signal<Employee[]>([]);
  rankedEmployees = signal<Employee[]>([]);
  description = signal<string>('');
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit(): void {
    this.loadProgressBoard();
  }

  private loadProgressBoard(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.progressBoardService.getProgressBoard().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const { top_performers, other_employees, description } = response.data;

          // Get top 3 performers (or less if available)
          const topPerformers = top_performers.slice(0, 3);

          // Reorder: rank 2, rank 1, rank 3 for the podium display
          const podiumOrder = [topPerformers[1], topPerformers[0], topPerformers[2]];
          this.topThree.set(podiumOrder.filter((e) => e !== undefined));

          // Other employees start after top 3
          this.rankedEmployees.set(other_employees);
          this.description.set(description);
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Failed to load progress board:', error);
        this.error.set('Failed to load progress board data');
        this.isLoading.set(false);
      },
    });
  }
}
