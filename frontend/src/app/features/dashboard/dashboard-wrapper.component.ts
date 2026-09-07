import { Component, OnInit, inject } from '@angular/core';
import { PHASE_CONFIG } from '../../core/tokens/phase.token';
import { AuthService } from '../../core/services/auth.service';
import { DashboardChildComponent } from './components/dashboard-child.component';
import { DashboardComponent } from './dashboard.component';
import { PhaseSwitcherComponent } from './components/phase-switcher.component';

@Component({
  selector: 'app-dashboard-wrapper',
  template: `
    <app-phase-switcher class="phase-switcher-host" />
    @if (phaseConfig().isChild) {
      <app-dashboard-child />
    } @else {
      <app-dashboard />
    }
  `,
  standalone: true,
  imports: [DashboardChildComponent, DashboardComponent, PhaseSwitcherComponent],
})
export class DashboardWrapperComponent implements OnInit {
  readonly phaseConfig = inject(PHASE_CONFIG);
  private readonly auth = inject(AuthService);

  ngOnInit(): void {
    this.auth.loadProfileAndEnrich();
  }
}
