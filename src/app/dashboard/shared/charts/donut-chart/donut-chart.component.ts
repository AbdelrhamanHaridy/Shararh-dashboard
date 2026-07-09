import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  TransformComponent,
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import type { PieSeriesOption } from 'echarts/charts';
import type {
  TitleComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
} from 'echarts/components';
import type { ComposeOption } from 'echarts/core';

// Create an Option type with only the required components and charts via ComposeOption
type ECOption = ComposeOption<
  PieSeriesOption | TitleComponentOption | TooltipComponentOption | LegendComponentOption
>;

// Register the required components
echarts.use([
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  TransformComponent,
  PieChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
]);

@Component({
  selector: 'app-donut-chart',
  imports: [],
  templateUrl: './donut-chart.component.html',
  styleUrl: './donut-chart.component.scss',
})
export class DonutChartComponent implements OnInit {
  @ViewChild('chartContainer', { static: true }) chartContainer!: ElementRef;
  @Input() chartData: any[] = [];
  @Input() chartTitle: string = '';
  @Input() padAngle: number = 5;

  private chartInstance: echarts.ECharts | null = null;

  ngOnInit(): void {
    this.initChart();
  }

  private initChart(): void {
    if (this.chartContainer) {
      this.chartInstance = echarts.init(this.chartContainer.nativeElement);
      this.setChartOption();
    }
  }

  private setChartOption(): void {
    const option: ECOption = {
      title: {
        text: this.chartTitle,
        left: 'right',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold',
        },
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)',
      },
      legend: {
        // padding: 20,
        orient: 'vertical',
        left: 'left',
        top: 'center',
      },
      series: [
        {
          name: 'Data',
          type: 'pie',
          radius: ['40%', '70%'],
          padAngle: this.padAngle,
          left: 'start',
          // right: 'right',
          itemStyle: {
            borderRadius: 5,
          },
          data: this.chartData,
          label: {
            show: false,
            position: 'center',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 14,
              fontWeight: 'bold',
            },
          },
          labelLine: {
            show: false,
          },
        },
      ],
    };

    if (this.chartInstance) {
      this.chartInstance.setOption(option);
    }
  }

  ngOnDestroy(): void {
    if (this.chartInstance) {
      this.chartInstance.dispose();
    }
  }
}
// {
//   tooltip: {
//     trigger: 'item'
//   },
//   legend: {
//     top: '5%',
//     left: 'center'
//   },
//   series: [
//     {
//       name: 'Access From',
//       type: 'pie',
//       radius: ['40%', '70%'],
//       avoidLabelOverlap: false,
//       padAngle: 5,
//       itemStyle: {
//         borderRadius: 10
//       },
//       label: {
//         show: false,
//         position: 'center'
//       },
//       emphasis: {
//         label: {
//           show: true,
//           fontSize: 40,
//           fontWeight: 'bold'
//         }
//       },
//       labelLine: {
//         show: false
//       },
//       data: [
//         { value: 1048, name: 'Search Engine' },
//         { value: 735, name: 'Direct' },
//         { value: 580, name: 'Email' },
//         { value: 484, name: 'Union Ads' },
//         { value: 300, name: 'Video Ads' }
//       ]
//     }
//   ]
// }
