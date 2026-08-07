import { Component, computed, inject, signal } from '@angular/core';
import { AuthService } from '../../../dashboard/pages/auth/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  private readonly authService = inject(AuthService);

  openMenu = signal(false);

  user = computed(() => this.authService.getCurrentUser());

  avatarSrc = computed(() => {
    const u = this.user();
    return u?.avatar_url || 'assets/testing/avatar.png';
  });

  toggleMenu(): void {
    this.openMenu.set(!this.openMenu());
  }

  logout(): void {
    this.authService.logout();
  }
}
