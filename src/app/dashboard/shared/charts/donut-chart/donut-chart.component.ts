import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonModule } from 'primeng/skeleton';

export interface DonutDataItem {
  value: number;
  name: string;
  color?: string;
}

interface RenderedSegment extends DonutDataItem {
  color: string;
  percentage: number;
  dashArray: string;
  dashOffset: number;
}

// Default palette used when chartData items don't specify their own color
const DEFAULT_PALETTE = [
  '#22C55E',
  '#EF4444',
  '#F59E0B',
  '#3B82F6',
  '#8B5CF6',
  '#475569',
  '#EC4899',
];

@Component({
  selector: 'app-donut-chart',
  standalone: true,
  imports: [CommonModule, SkeletonModule],
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.scss',
})
export class DonutChartComponent implements OnChanges {
  @Input() chartData: DonutDataItem[] = [];
  @Input() chartTitle: string = '';
  @Input() padAngle: number = 5;
  @Input() isLoading = false;

  @Input() centerValue?: string;
  @Input() centerLabel?: string;
  @Input() size = 140;
  @Input() strokeWidth = 14;

  segments: RenderedSegment[] = [];

  ngOnChanges(): void {
    this.buildSegments();
  }

  get center(): number {
    return this.size / 2;
  }

  get radius(): number {
    return (this.size - this.strokeWidth) / 2;
  }

  get circumference(): number {
    return 2 * Math.PI * this.radius;
  }

  private buildSegments(): void {
    const total = this.chartData.reduce((sum, d) => sum + (d.value || 0), 0);
    const circ = this.circumference;
    let cumulative = 0;

    this.segments = this.chartData.map((d, i) => {
      const percentage = total > 0 ? (d.value / total) * 100 : 0;
      const rawLength = (percentage / 100) * circ;
      const segmentLength = Math.max(rawLength - this.padAngle, 0);
      const dashOffset = -cumulative;
      cumulative += rawLength;

      return {
        ...d,
        color: d.color || DEFAULT_PALETTE[i % DEFAULT_PALETTE.length],
        percentage: Math.round(percentage),
        dashArray: `${segmentLength} ${circ}`,
        dashOffset,
      };
    });
  }

  get displayValue(): string {
    if (this.centerValue) return this.centerValue;
    return this.segments.length ? `${this.segments[0].percentage}%` : '0%';
  }

  get displayLabel(): string {
    if (this.centerLabel) return this.centerLabel;
    return this.chartData.length ? this.chartData[0].name : '';
  }
}
