import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MenuItem } from 'primeng/api';

interface TopEmployee {
  id: number;
  name: string;
  position: string;
  points: number;
  avatar: string;
  rank: number;
}

interface RankedEmployee {
  id: number;
  rank: number;
  name: string;
  position: string;
  points: number;
  avatar: string;
}

@Component({
  selector: 'app-progress-board',
  imports: [CommonModule, PageHeaderComponent],
  templateUrl: './progress-board.html',
  styleUrl: './progress-board.scss',
})
export class ProgressBoard {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };
  breadcrumbItems: MenuItem[] = [{ label: 'لوحة التقدم', routerLink: '/progress-board' }];

  topThree: TopEmployee[] = [
    {
      id: 2,
      rank: 2,
      name: 'لين كيلر',
      position: 'مسؤلة',
      points: 1500,
      avatar: 'assets/testing/avatar.png',
    },
    {
      id: 1,
      rank: 1,
      name: 'احمد العتيبي',
      position: 'المدير العام',
      points: 13450,
      avatar: 'assets/testing/avatar.png',
    },
    {
      id: 3,
      rank: 3,
      name: 'سارة المتنوري',
      position: 'مسؤلة',
      points: 1240,
      avatar: 'assets/testing/avatar.png',
    },
  ];

  rankedEmployees: RankedEmployee[] = [
    {
      id: 4,
      rank: 4,
      name: 'خالد الشمري',
      position: 'محاسب اول',
      points: 945,
      avatar: 'assets/testing/avatar.png',
    },
    {
      id: 5,
      rank: 5,
      name: 'نورة السديري',
      position: 'محاسب اول',
      points: 945,
      avatar: 'assets/testing/avatar.png',
    },
    {
      id: 6,
      rank: 6,
      name: 'خالد الشمري',
      position: 'محاسب اول',
      points: 945,
      avatar: 'assets/testing/avatar.png',
    },
    {
      id: 7,
      rank: 6,
      name: 'خالد الشمري',
      position: 'محاسب اول',
      points: 945,
      avatar: 'assets/testing/avatar.png',
    },
  ];
}
