// shared/services/context-menu.service.ts
import { Injectable, signal } from '@angular/core';

export interface ContextMenuItem {
  label: string;
  color?: string;
  icon?: string;
  disabled?: boolean;
  command: () => void;
}

interface ContextMenuState {
  items: ContextMenuItem[];
  position: { top: number; left: number };
  // Identifies which trigger opened it, so a trigger can tell if IT is the
  // currently-open one (for toggle-closed-on-second-click behavior).
  ownerId: symbol;
}

@Injectable({ providedIn: 'root' })
export class ContextMenuService {
  readonly state = signal<ContextMenuState | null>(null);

  open(ownerId: symbol, items: ContextMenuItem[], position: { top: number; left: number }): void {
    this.state.set({ ownerId, items, position });
  }

  close(): void {
    this.state.set(null);
  }

  isOpenFor(ownerId: symbol): boolean {
    return this.state()?.ownerId === ownerId;
  }
}