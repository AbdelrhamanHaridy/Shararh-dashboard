import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { SharedKpiCard } from '../../shared/components/shared-kpi-card/shared-kpi-card';
import { SharedTextInputComponent } from '../../shared/components/shared-text-input/shared-text-input.component';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-frequently-asked-questions',
  imports: [AccordionModule, CommonModule, PageHeaderComponent, SharedKpiCard],
  templateUrl: './frequently-asked-questions.html',
  styleUrl: './frequently-asked-questions.scss',
})
export class FrequentlyAskedQuestions {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };
  breadcrumbItems: MenuItem[] = [
    { label: 'الاسئله الشائعه', routerLink: '/frequently-asked-questions' },
  ];
}
