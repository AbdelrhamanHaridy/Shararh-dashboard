import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AccordionModule } from 'primeng/accordion';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { MenuItem, ConfirmationService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { Router } from '@angular/router';
import { FrequentlyAskedQuestionsService } from './services/frequently-asked-questions.service';
import { debounceTime, distinctUntilChanged, Subject, takeUntil } from 'rxjs';
import { BaseComponent } from '../../shared/services/base.component';
import { Faq, FaqFilterParams } from './models/frequently-asked-questions.model';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { AddFaqDialog } from './components/add-faq-dialog/add-faq-dialog';
import { EditFaqDialog } from './components/edit-faq-dialog/edit-faq-dialog';

interface TargetTypeFilter {
  label: string;
  value: string | null;
}

@Component({
  selector: 'app-frequently-asked-questions',
  imports: [AccordionModule, CommonModule, PageHeaderComponent, FormsModule, ConfirmDialogModule],
  providers: [DialogService, ConfirmationService],
  templateUrl: './frequently-asked-questions.html',
  styleUrl: './frequently-asked-questions.scss',
})
export class FrequentlyAskedQuestions extends BaseComponent implements OnInit {
  home: MenuItem = { label: 'لوحة التحكم', routerLink: '/' };
  breadcrumbItems: MenuItem[] = [
    { label: 'الاسئله الشائعه', routerLink: '/frequently-asked-questions' },
  ];

  faqs: Faq[] = [];
  isLoading = false;
  errorMessage = '';

  searchTerm = '';
  private searchChanged = new Subject<string>();

  ref: DynamicDialogRef | null = null;

  targetTypeFilters: TargetTypeFilter[] = [
    { label: 'الكل', value: null },
    { label: 'عام', value: 'general' },
    { label: 'التاجر', value: 'owner' },
    { label: 'الكاشير', value: 'cashier' },
    { label: 'المندوب', value: 'collector' },
  ];
  activeTargetType: string | null = null;

  private targetTypeMeta: Record<string, { label: string; color: string }> = {
    all: { label: 'عام', color: '#137FEC' },
    general: { label: 'عام', color: '#137FEC' },
    owner: { label: 'التاجر', color: '#F1B31C' },
    cashier: { label: 'الكاشير', color: '#10A922' },
    collector: { label: 'المندوب', color: '#C293FF' },
  };

  constructor(
    private router: Router,
    private faqService: FrequentlyAskedQuestionsService,
    public dialogService: DialogService,
    private confirmationService: ConfirmationService,
    private cdr: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit(): void {
    this.onGetFaqs();

    this.searchChanged
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe((term) => {
        this.searchTerm = term;
        this.onGetFaqs();
      });
  }

  get pinnedFaqs(): Faq[] {
    return this.faqs
      .filter((f) => f.is_pinned)
      .sort((a, b) => (a.pin_order ?? 0) - (b.pin_order ?? 0));
  }

  get unpinnedFaqs(): Faq[] {
    return this.faqs.filter((f) => !f.is_pinned);
  }

  onGetFaqs() {
    this.isLoading = true;
    this.errorMessage = '';

    const filters: FaqFilterParams = {};
    if (this.searchTerm) filters.search = this.searchTerm;
    if (this.activeTargetType) filters.target_type = this.activeTargetType;

    this.faqService
      .getFaqs(filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.faqs = res.data ?? [];
          this.isLoading = false;
          // Force the view to update immediately instead of waiting for the
          // next CD trigger (which is what "opening the dialog" was doing for you)
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching data:', err);
          this.errorMessage = 'حدث خطأ أثناء تحميل الأسئلة الشائعة';
          this.isLoading = false;
          this.cdr.detectChanges();
        },
      });
  }

  onSearchInput(value: string) {
    this.searchChanged.next(value);
  }

  onSelectTargetType(value: string | null) {
    if (this.activeTargetType === value) return;
    this.activeTargetType = value;
    this.onGetFaqs();
  }

  isActiveTargetType(value: string | null): boolean {
    return this.activeTargetType === value;
  }

  getBadgeMeta(targetType: string) {
    return this.targetTypeMeta[targetType] ?? { label: targetType, color: '#64748B' };
  }

  trackByFaqId(_index: number, faq: Faq): number {
    return faq.id;
  }

  onTogglePin(faq: Faq, event: Event) {
    event.stopPropagation();
    const wasPinned = faq.is_pinned;

    this.faqs = this.faqs.map((f) => (f.id === faq.id ? { ...f, is_pinned: !wasPinned } : f));
    this.cdr.detectChanges();

    this.faqService
      .toggleFaqPin(faq.id, wasPinned)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res?.data?.id) {
            const updated = res.data;
            this.faqs = this.faqs.map((f) => (f.id === updated.id ? updated : f));
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.error('Error toggling pin:', err);
          this.faqs = this.faqs.map((f) => (f.id === faq.id ? { ...f, is_pinned: wasPinned } : f));
          this.cdr.detectChanges();
        },
      });
  }

  onDelete(faq: Faq, event: Event) {
    event.stopPropagation();

    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: `هل أنت متأكد من حذف السؤال: "${faq.question}"؟`,
      header: 'تأكيد الحذف',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'حذف',
      rejectLabel: 'إلغاء',
      acceptButtonStyleClass: 'p-button-danger',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.faqService
          .deleteFaq(faq.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.faqs = this.faqs.filter((f) => f.id !== faq.id);
              this.cdr.detectChanges();
            },
            error: (err) => {
              console.error('Error deleting FAQ:', err);
            },
          });
      },
    });
  }

  onCopyAnswer(faq: Faq, event: Event) {
    event.stopPropagation();
    navigator.clipboard?.writeText(faq.answer).catch((err) => {
      console.error('Failed to copy answer:', err);
    });
  }

  showAddFaqDialog() {
    this.ref = this.dialogService.open(AddFaqDialog, {
      header: 'إضافة سؤال جديد',
      width: '502px',
      modal: true,
      closable: true,
      breakpoints: {
        '960px': '75vw',
        '640px': '90vw',
      },
    });

    if (this.ref) {
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe((created: Faq | undefined) => {
        if (created) {
          this.faqs = [created, ...this.faqs];
          this.cdr.detectChanges();
        }
      });
    }
  }

  onEdit(faq: Faq, event: Event) {
    event.stopPropagation();
    this.faqService
      .getFaqById(faq.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          const ref = this.dialogService.open(EditFaqDialog, {
            header: 'تعديل السؤال',
            width: '700px',
            data: { faq: res.data.faq },
          });

          if (ref) {
            ref.onClose.pipe(takeUntil(this.destroy$)).subscribe((updated: Faq | undefined) => {
              if (updated) {
                this.faqs = this.faqs.map((f) => (f.id === updated.id ? updated : f));
                this.cdr.detectChanges();
              }
            });
          }
        },
        error: (err) => console.error('Error fetching FAQ:', err),
      });
  }
}
