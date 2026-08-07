import { Component, signal, computed, inject } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { Sidebar } from './core/components/sidebar/sidebar';
import { Header } from './core/components/header/header';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, Header],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('sharara-project');
  private router = inject(Router);
  protected isAuthRoute = signal(false);
  protected isMobileSidebarOpen = signal(false);

  constructor() {
    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.isAuthRoute.set(this.router.url.includes('/auth'));
      this.isMobileSidebarOpen.set(false);
    });
    // Check initial route
    this.isAuthRoute.set(this.router.url.includes('/auth'));
  }

  protected openMobileSidebar(): void {
    this.isMobileSidebarOpen.set(true);
  }

  protected closeMobileSidebar(): void {
    this.isMobileSidebarOpen.set(false);
  }
}
