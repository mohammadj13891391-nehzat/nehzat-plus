import { Component, inject, ChangeDetectionStrategy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-shared-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SharedHeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  /** Username from auth service (admin passes 'username' input, BM passes 'currentUser' input) */
  @Input() username: string = this.authService.getCurrentUser()?.username ?? '';

  /** True if we should show the logout button (default true) */
  @Input() showLogout: boolean = true;

  /** Custom page title to display (e.g. 'داشبورد مدیریت' or 'داشبورد مسئول شعبه') */
  @Input() pageTitle: string = '';

  /** Optional logo src attribute (BM provides 'assets/nehzat.png', admin can omit) */
  @Input() logoSrc: string = '';

  /** Optional logo error handler (BM only) */
  @Input() onLogoError: (e: Event) => void = () => {
    // placeholder - BM handles logo hiding
  };

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }
}