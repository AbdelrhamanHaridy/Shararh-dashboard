import { Component } from '@angular/core';
import { SharedKpiCard } from '../../shared/components/shared-kpi-card/shared-kpi-card';

@Component({
  selector: 'app-home',
  imports: [SharedKpiCard],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {}
