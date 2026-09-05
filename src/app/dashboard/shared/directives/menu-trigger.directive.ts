// shared/directives/menu-trigger.directive.ts
import { Directive, ElementRef, HostListener, Input, inject } from '@angular/core';
import { ContextMenuService, ContextMenuItem } from '../services/context-menu.service';

@Directive({
  selector: '[appMenuTrigger]',
  standalone: true,
})
export class MenuTriggerDirective {
  @Input('appMenuTrigger') items: ContextMenuItem[] = [];

  // Optional: offset/alignment tweaks per use-site if ever needed
  @Input() menuAlign: 'left' | 'right' = 'left';

  private readonly menuService = inject(ContextMenuService);
  private readonly elementRef = inject(ElementRef<HTMLElement>);

  // Unique identity per directive instance — lets the same trigger
  // recognize "I'm the one currently open" to support toggle-to-close.
  private readonly ownerId = Symbol('menuTrigger');

  @HostListener('click', ['$event'])
  onClick(event: Event): void {
    event.stopPropagation();

    if (this.menuService.isOpenFor(this.ownerId)) {
      this.menuService.close();
      return;
    }

    if (!this.items || this.items.length === 0) return;

    const rect = this.elementRef.nativeElement.getBoundingClientRect();
    const left = this.menuAlign === 'right' ? rect.right - 160 : rect.left;

    this.menuService.open(this.ownerId, this.items, { top: rect.bottom + 4, left });
  }
}
