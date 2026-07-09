import { Component } from '@angular/core';
import { SharedKpiCard } from '../../shared/components/shared-kpi-card/shared-kpi-card';
import { ChildTableComponent } from '../../shared/components/child-table/child-table.component';
import { SliderModule } from 'primeng/slider';


@Component({
  selector: 'app-home',
  imports: [SharedKpiCard, ChildTableComponent, SliderModule],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  sessionColumns: any[] = [
    { field: 'player', header: 'اسم الموظف' },
    { field: 'sport', header: 'الدور' },
    { field: 'date', header: 'البدء / الانتهاء' },
    { field: 'duration', header: 'النقاط' },
    { field: 'status', header: 'الحاله' },
  ];

  sessions: any[] = [
    {
      player: 'Omar Hassan',
      sport: 'Football',
      date: '25 Jan 2026',
      duration: '60 min',
      status: 'Completed',
    },
    {
      player: 'Sara Ahmed',
      sport: 'Football',
      date: '22 Jan 2026',
      duration: '45 min',
      status: 'Completed',
    },
    {
      player: 'Ali Youssef',
      sport: 'Football',
      date: '20 Jan 2026',
      duration: '60 min',
      status: 'Cancelled',
    },
    {
      player: 'Layla Khaled',
      sport: 'Football',
      date: '18 Jan 2026',
      duration: '90 min',
      status: 'Completed',
    },

  ];
}
