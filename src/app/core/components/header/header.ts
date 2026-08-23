import { Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../dashboard/pages/auth/services/auth.service';
import {
  SessionService,
  CurrentSessionResponse,
} from '../../../dashboard/pages/auth/services/session.service';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly authService = inject(AuthService);
  private readonly sessionService = inject(SessionService);
  private readonly router = inject(Router);

  openMenu = signal(false);
  currentSession = signal<CurrentSessionResponse | null>(null);
  isLoadingSession = signal(false);

  user = computed(() => this.authService.getCurrentUser());

  avatarSrc = computed(() => {
    const u = this.user();
    return u?.avatar_url || 'assets/testing/avatar.png';
  });

  isEmployee = computed(() => {
    const u = this.user();
    if (!u) return false;
    const roles: string[] = Array.isArray(u.roles) ? u.roles : [];
    const employeeRoles = ['supervisor', 'customer_service', 'sales', 'technical_support'];
    return roles.some((r) => employeeRoles.includes(r));
  });

  hasActiveSession = computed(() => {
    const session = this.currentSession();
    return session?.success && session.data?.session?.status === 'active';
  });

  ngOnInit(): void {
    if (this.isEmployee()) {
      this.loadCurrentSession();
    }
  }

  loadCurrentSession(): void {
    this.sessionService.getCurrentSession().subscribe({
      next: (response) => {
        // Only set session if it's active and successful
        if (response.success && response.data?.session?.status === 'active') {
          this.currentSession.set(response);
        } else {
          this.currentSession.set(null);
        }
      },
      error: (error) => {
        // 404 means no active session - this is expected, not an error
        if (error?.status === 404) {
          this.currentSession.set(null);
        } else {
          console.error('Failed to load session:', error);
          this.currentSession.set(null);
        }
      },
    });
  }

  toggleMenu(): void {
    this.openMenu.set(!this.openMenu());
  }

  startSession(): void {
    this.router.navigate(['/auth/start-session']);
  }

  endSession(): void {
    const session = this.currentSession();
    if (!session?.data?.session?.id) return;

    this.isLoadingSession.set(true);
    this.sessionService.endSession(session.data.session.id).subscribe({
      next: () => {
        this.isLoadingSession.set(false);
        this.currentSession.set(null);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        this.isLoadingSession.set(false);
        console.error('Failed to end session:', error);
      },
    });
  }

  logout(): void {
    this.authService.logout();
  }
}
