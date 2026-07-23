import { Component, OnInit } from '@angular/core';
import { SharedKpiCard } from '../../shared/components/shared-kpi-card/shared-kpi-card';
import { ChildTableComponent } from '../../shared/components/child-table/child-table.component';
import { SliderModule } from 'primeng/slider';
import { DonutChartComponent } from '../../shared/charts/donut-chart/donut-chart.component';
import { NotificationComponent } from '../../shared/components/notification/notification';
import { BaseComponent } from '../../shared/services/base.component';
import { HomeService } from './services/home.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  imports: [
    SharedKpiCard,
    ChildTableComponent,
    SliderModule,
    DonutChartComponent,
    NotificationComponent,
  ],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home extends BaseComponent implements OnInit {
  constructor(private homeService: HomeService) {
    super();
  }
  ngOnInit(): void {
    this.homeService
      .getDashboard()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          console.log(res);
          
        },
        error: (err) => {
          console.error('Error fetching dashboard data:', err);
        },
      });
  }
  sessionColumns: any[] = [
    { field: 'name', header: 'اسم الموظف' },
    { field: 'role', header: 'الدور' },
    { field: 'from_time', header: 'البدء / الانتهاء' },
    { field: 'points', header: 'النقاط' },
    { field: 'status', header: 'الحاله' },
  ];

  sessions: any[] = [
    {
      name: 'Omar Hassan',
      role: 'تاجر',
      from_time: '08:00 ص',
      to_time: '04:00 م',
      points: '940',
      status: 'نشط',
    },
    {
      name: 'Sara Ahmed',
      role: 'مندوب',
      from_time: '08:00 ص',
      to_time: '04:00 م',
      points: '940',
      status: 'نشط',
    },
    {
      name: 'Ali Youssef',
      role: 'مدرب',
      from_time: '08:00 ص',
      to_time: '04:00 م',
      points: '940',
      status: 'غير نشط',
    },
    {
      name: 'Layla Khaled',
      role: 'مدرب',
      from_time: '08:00 ص',
      to_time: '04:00 م',
      points: '940',
      status: 'نشط',
    },
    {
      name: 'Layla Khaled',
      role: 'مدرب',
      from_time: '08:00 ص',
      to_time: '04:00 م',
      points: '940',
      status: 'نشط',
    },
  ];
}
