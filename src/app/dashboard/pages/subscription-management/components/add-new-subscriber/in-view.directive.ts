// shared/directives/in-view.directive.ts
import { AfterViewInit, Directive, ElementRef, OnDestroy, inject, output } from '@angular/core';

/**
 * Emits `inView` when the host element becomes visible (e.g. scrolled into view
 * inside an overflow container). Used as an infinite-scroll sentinel.
 */
@Directive({
  selector: '[appInView]',
})
export class InViewDirective implements AfterViewInit, OnDestroy {
  readonly inView = output<void>();

  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  private observer?: IntersectionObserver;

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          this.inView.emit();
        }
      },
      { threshold: 0.1 },
    );
    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
