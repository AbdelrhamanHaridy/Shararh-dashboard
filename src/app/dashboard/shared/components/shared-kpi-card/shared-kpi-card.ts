import { Component, input } from '@angular/core';

@Component({
  selector: 'app-shared-kpi-card',
  imports: [],
  templateUrl: './shared-kpi-card.html',
  styleUrl: './shared-kpi-card.scss',
})
export class SharedKpiCard {
  title = input<string>('');
  number = input<string | number>('');
  iconPath = input<string>('');
  iconBgColor = input<string>('#C3E1FF');
  numberColor = input<string>('');
  navigateLink = input<string | null>(null);
}
