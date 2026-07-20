import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface SelectOption {
  label: string;
  value: string;
}

interface KpiCard {
  label: string;
  value: string;
  iconPath: string;
  fullWidth?: boolean;
}
@Component({
  selector: 'app-salary-and-performance-details-dialog',
  imports: [CommonModule, FormsModule],
  templateUrl: './salary-and-performance-details-dialog.html',
  styleUrl: './salary-and-performance-details-dialog.scss',
})
export class SalaryAndPerformanceDetailsDialog {
  employee = {
    name: 'احمد محمد علي',
    role: 'خدمة عملاء',
    avatarUrl: 'assets/images/avatars/employee.jpg',
    dailyWorkHours: 8,
    monthlyWorkDays: 26,
  };

  currency = 'EGP';
  baseSalary = '6,800';

  salaryTypeOptions: SelectOption[] = [
    { label: 'اساسي فقط', value: 'base_only' },
    { label: 'اساسي + عمولة', value: 'base_plus_commission' },
    { label: 'اساسي + حوافز', value: 'base_plus_incentives' },
  ];
  selectedSalaryType = 'base_only';

  incentivesEnabled = true;

  incentiveTypeOptions: SelectOption[] = [
    { label: 'حوافز يوميه', value: 'daily' },
    { label: 'حوافز شهرية', value: 'monthly' },
  ];
  selectedIncentiveType = 'daily';

  attendanceCommitmentBonus = 100;
  dailyPointsBonus = 100;

  kpis: KpiCard[] = [
    { label: 'عدد الورديات', value: '24', iconPath: 'assets/icons/global/reset_calendar.svg' },
    { label: 'ساعات العمل', value: '192', iconPath: 'assets/icons/global/grey_clock.svg' },
    { label: 'الأرباح الناتجة', value: '12,450', iconPath: 'assets/icons/global/rising_up.svg' },
    { label: 'عدد الأخطاء', value: '2', iconPath: 'assets/icons/global/yellow_warning.svg' },
    {
      label: 'مرات العجز النقدي',
      value: '0',
      iconPath: 'assets/icons/global/minus_cart.svg',
      fullWidth: true,
    },
  ];

  toggleIncentives(): void {
    this.incentivesEnabled = !this.incentivesEnabled;
  }

  onClose(): void {
    // TODO: close dialog
  }
}
