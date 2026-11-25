import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import {
  AutoComplete,
  AutoCompleteCompleteEvent,
  AutoCompleteSelectEvent,
} from 'primeng/autocomplete';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { Subject, catchError, map, of, switchMap } from 'rxjs';
import { SharedSelectComponent } from '../../../../shared/components/shared-select/shared-select.component';
import { ToastService } from '../../../../shared/services/toast.service';
import { SubscriptionsService } from '../../services/subscriptions.service';
import { PricingAndPlansService } from '../../../more/pages/pricing-and-plans/services/pricing-and-plans.service';
import { Plan } from '../../../more/pages/pricing-and-plans/models/pricing-and-plans.model';
import { PaymentMethodsService } from '../../../more/pages/payment-methods-settings/services/payment-methods-settings.service';
import { PaymentMethodApiResponse } from '../../../more/pages/payment-methods-settings/models/payment-methods-settings.model';
import {
  OwnersQuery,
  OwnersResponse,
  AddSubscriberPayload,
  Owner,
} from '../../../user-database/models/subscription-owners.model';
import { InViewDirective } from './in-view.directive';

interface SelectOption<T = number | string> {
  label: string;
  value: T;
}

interface OwnersRequest {
  query: OwnersQuery;
  key: string;
  page: number;
}

interface OwnersCacheEntry {
  items: Owner[];
  page: number;
  hasMore: boolean;
}

@Component({
  selector: 'app-add-new-subscriber',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedSelectComponent,
    AutoComplete,
    ToggleSwitchModule,
    InViewDirective,
  ],
  templateUrl: './add-new-subscriber.html',
  styleUrl: './add-new-subscriber.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddNewSubscriber implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly subscriptionsService = inject(SubscriptionsService);
  private readonly pricingAndPlansService = inject(PricingAndPlansService);
  private readonly paymentMethodsService = inject(PaymentMethodsService);
  private readonly cdr = inject(ChangeDetectorRef);

  subscriberForm!: FormGroup;

  // Autocomplete state
  ownerSuggestions: Owner[] = [];
  selectedOwner: Owner | null = null;
  stores: SelectOption<number>[] = [];

  // Pagination / infinite scroll state
  hasMoreOwners = false;
  isLoadingOwners = false;
  private activeKey = '';
  private activeQuery: OwnersQuery = {};

  // One entry per distinct search (by name / phone / empty). Lives as long as the dialog.
  private readonly ownersCache = new Map<string, OwnersCacheEntry>();

  // `null` cancels whatever request is in flight
  private readonly ownersRequest$ = new Subject<OwnersRequest | null>();

  isSubmitting = false;
  isLoadingPlans = true;
  isLoadingPaymentMethods = true;

  packages: SelectOption<number>[] = [];

  // Matches the plan price fields: monthly_price / semi_annual_price / yearly_price
  subscriptionDurations: SelectOption<string>[] = [
    { label: 'شهري', value: 'monthly' },
    { label: 'نصف سنوي', value: 'semi_annual' },
    { label: 'سنوي', value: 'yearly' },
  ];

  paymentMethods: SelectOption<number>[] = [];

  constructor(
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig,
    private fb: FormBuilder,
    private toastService: ToastService,
  ) {}

  // Id of the last suggestion, it carries the infinite-scroll sentinel in the template
  get lastOwnerId(): number | undefined {
    return this.ownerSuggestions[this.ownerSuggestions.length - 1]?.id;
  }

  ngOnInit(): void {
    this.subscriberForm = this.fb.group({
      subscriberName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      storeId: [null, Validators.required],
      packageType: [null, Validators.required],
      subscriptionDuration: [null, Validators.required],
      paymentMethod: [null, Validators.required],
      paymentNotes: [''],
    });

    this.loadPlans();
    this.loadPaymentMethods();
    this.setupOwnersPipeline();

    // If the user edits the text after picking an owner, the link is no longer valid
    this.watchManualEdit('subscriberName', 'name');
    this.watchManualEdit('phoneNumber', 'phone');
  }

  private loadPlans(): void {
    this.pricingAndPlansService
      .getPlans()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.packages = (response.data ?? [])
            .filter((plan: Plan) => plan.is_active)
            .map((plan) => ({ label: plan.name, value: plan.id }));
          this.isLoadingPlans = false;
          this.cdr.markForCheck();
        },
        error: (error: unknown) => {
          console.error('Error fetching plans:', error);
          this.packages = [];
          this.isLoadingPlans = false;
          this.toastService.error('تعذر تحميل الباقات', 'يرجى المحاولة مرة أخرى.');
          this.cdr.markForCheck();
        },
      });
  }

  private loadPaymentMethods(): void {
    this.paymentMethodsService
      .getPaymentMethods()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.paymentMethods = (response.data?.payment_methods ?? [])
            .filter((method: PaymentMethodApiResponse) => method.is_active)
            .map((method) => ({ label: method.name, value: method.id }));
          this.isLoadingPaymentMethods = false;
          this.cdr.markForCheck();
        },
        error: (error: unknown) => {
          console.error('Error fetching payment methods:', error);
          this.paymentMethods = [];
          this.isLoadingPaymentMethods = false;
          this.toastService.error('تعذر تحميل طرق الدفع', 'يرجى المحاولة مرة أخرى.');
          this.cdr.markForCheck();
        },
      });
  }

  // ---------- Owners: search + pagination + cache ----------
  private setupOwnersPipeline(): void {
    this.ownersRequest$
      .pipe(
        // switchMap cancels the previous HTTP call when a new search / page is requested
        switchMap((req) => {
          if (!req) return of(null);

          this.isLoadingOwners = true;
          this.cdr.markForCheck();

          return this.subscriptionsService.getOwners({ ...req.query, page: req.page }).pipe(
            map((res) => ({ req, res })),
            catchError((err) => {
              console.error('Error fetching owners:', err);
              return of({ req, res: null as OwnersResponse | null });
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((result) => {
        this.isLoadingOwners = false;

        if (result) {
          this.onOwnersLoaded(result.req, result.res);
        }
        this.cdr.markForCheck();
      });
  }

  private onOwnersLoaded(req: OwnersRequest, res: OwnersResponse | null): void {
    if (!res) {
      // Failed first page: show nothing. Failed next page: keep what we have.
      if (req.page === 1) {
        this.ownerSuggestions = [];
        this.hasMoreOwners = false;
      }
      return;
    }

    const previous = req.page > 1 ? (this.ownersCache.get(req.key)?.items ?? []) : [];
    const seen = new Set(previous.map((o) => o.id));
    const items = [...previous, ...res.data.filter((o) => !seen.has(o.id))];

    const entry: OwnersCacheEntry = {
      items,
      page: res.pagination.current_page,
      hasMore: res.pagination.has_more_pages,
    };
    this.ownersCache.set(req.key, entry);
    this.showEntry(entry);
  }

  // Always a NEW array reference, so the p-autocomplete input setter fires and opens the panel
  private showEntry(entry: OwnersCacheEntry): void {
    this.ownerSuggestions = [...entry.items];
    this.hasMoreOwners = entry.hasMore;
  }

  private searchOwners(query: OwnersQuery): void {
    const key = JSON.stringify(query);
    this.activeKey = key;
    this.activeQuery = query;

    const cached = this.ownersCache.get(key);
    if (cached) {
      // No request: reuse the results and cancel anything still in flight
      this.ownersRequest$.next(null);
      this.isLoadingOwners = false;
      this.showEntry(cached);
      return;
    }

    this.ownersRequest$.next({ query, key, page: 1 });
  }

  // Called by the sentinel in the last suggestion when it scrolls into view
  loadMoreOwners(): void {
    if (this.isLoadingOwners || !this.hasMoreOwners) return;

    const entry = this.ownersCache.get(this.activeKey);
    if (!entry) return;

    this.ownersRequest$.next({
      query: this.activeQuery,
      key: this.activeKey,
      page: entry.page + 1,
    });
  }

  // ---------- Autocomplete handlers ----------
  // With the dropdown button, an empty query is sent, which returns the latest owners
  onSearchName(event: AutoCompleteCompleteEvent): void {
    const q = event.query?.trim();
    this.searchOwners(q ? { name: q } : {});
  }

  onSearchPhone(event: AutoCompleteCompleteEvent): void {
    const q = event.query?.trim();
    this.searchOwners(q ? { phone: q } : {});
  }

  // Selecting from either field fills the other one and loads the owner's stores
  onOwnerSelect(event: AutoCompleteSelectEvent): void {
    const owner = event.value as Owner;

    this.selectedOwner = owner;
    this.stores = owner.stores.map((s) => ({ label: s.name, value: s.id }));

    this.subscriberForm.patchValue(
      {
        subscriberName: owner.name,
        phoneNumber: owner.phone,
        storeId: owner.stores.length === 1 ? owner.stores[0].id : null,
      },
      { emitEvent: false },
    );
    this.cdr.markForCheck();
  }

  private watchManualEdit(controlName: 'subscriberName' | 'phoneNumber', key: 'name' | 'phone') {
    this.subscriberForm
      .get(controlName)!
      .valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (typeof value === 'string' && this.selectedOwner && value !== this.selectedOwner[key]) {
          this.selectedOwner = null;
          this.stores = [];
          this.subscriberForm.patchValue({ storeId: null }, { emitEvent: false });
          this.cdr.markForCheck();
        }
      });
  }

  // ---------- Submit ----------
  get canSubmit(): boolean {
    return this.subscriberForm.valid && !!this.selectedOwner && !this.isSubmitting;
  }

  closeDialog(data?: any): void {
    this.ref.close(data);
  }

  saveAndClose(): void {
    if (!this.canSubmit || !this.selectedOwner) {
      this.subscriberForm.markAllAsTouched();
      return;
    }

    const v = this.subscriberForm.value;
    const payload: AddSubscriberPayload = {
      owner_id: this.selectedOwner.id,
      store_id: v.storeId,
      plan_id: v.packageType,
      duration: v.subscriptionDuration,
      payment_method_id: v.paymentMethod,
    };

    this.isSubmitting = true;
    this.subscriptionsService
      .addSubscriber(payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.isSubmitting = false;
          this.toastService.success('تمت الإضافة', 'تم تفعيل الاشتراك بنجاح');
          this.cdr.markForCheck();
          this.closeDialog({ success: true, data: res?.data ?? payload });
        },
        error: (err) => {
          this.isSubmitting = false;
          const message =
            err?.error?.message ||
            (Object.values(err?.error?.errors ?? {})[0] as string[] | undefined)?.[0] ||
            'حدث خطأ أثناء تفعيل الاشتراك';
          this.toastService.error('خطأ', message);
          this.cdr.markForCheck();
        },
      });
  }
}
