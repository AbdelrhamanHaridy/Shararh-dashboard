// shared/components/context-menu/context-menu.component.ts
import { Component, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';
import { ContextMenuService, ContextMenuItem } from '../../services/context-menu.service';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss',
})
export class ContextMenuComponent {
  private readonly menuService = inject(ContextMenuService);
  private readonly router = inject(Router);

  state = this.menuService.state;

  constructor() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.menuService.close();
      }
    });
  }

  // Clicking anywhere outside an open menu closes it. Triggers themselves
  // stop propagation on their own click handler (see directive), so this
  // only ever fires for genuine "outside" clicks.
  @HostListener('document:click')
  onDocumentClick(): void {
    this.menuService.close();
  }

  @HostListener('window:scroll')
  @HostListener('window:resize')
  onViewportChange(): void {
    this.menuService.close();
  }

  onItemClick(item: ContextMenuItem, event: Event): void {
    event.stopPropagation();
    if (item.disabled) return;
    item.command();
    this.menuService.close();
  }
}