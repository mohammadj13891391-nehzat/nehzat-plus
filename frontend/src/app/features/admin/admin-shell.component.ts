import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SharedHeaderComponent } from '../../shared/header/header.component';
import { SharedModule } from '../../shared/shared.module';

@Component({
  selector: 'app-admin-shell',
  standalone: true,
  imports: [RouterModule, SharedHeaderComponent, SharedModule],
  templateUrl: './admin-shell.component.html',
  styleUrls: ['./admin-shell.component.scss']
})
export class AdminShellComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  logout(): void {
    this.authService.logout();
    void this.router.navigateByUrl('/auth/login');
  }
}