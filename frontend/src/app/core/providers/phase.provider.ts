import { Provider, inject, computed, signal } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PHASE_CONFIG, PhaseConfig } from '../tokens/phase.token';

const PHASE_MATURITY: Record<string, PhaseConfig['phase']> = {
  A: 'A',
  B: 'B',
  C: 'C',
  D: 'D',
  E: 'E',
};

const STORAGE_KEY = 'lp_phase_override';

function readStoredPhase(): PhaseConfig['phase'] | null {
  if (typeof window === 'undefined') return null;
  const v = localStorage.getItem(STORAGE_KEY);
  return v && PHASE_MATURITY[v] ? (v as PhaseConfig['phase']) : null;
}

export function providePhaseConfig(): Provider {
  return {
    provide: PHASE_CONFIG,
    useFactory: () => {
      const auth = inject(AuthService);
      const storedPhase = signal<PhaseConfig['phase'] | null>(readStoredPhase());

      return computed<PhaseConfig>(() => {
        const authPhase = auth.phase() as PhaseConfig['phase'] | null;
        const stored = storedPhase();
        const resolved = stored ?? (authPhase && PHASE_MATURITY[authPhase] ? authPhase : 'A');

        return {
          phase: resolved,
          isChild: resolved === 'A' || resolved === 'B',
          isPreTeen: resolved === 'C',
          isTeen: resolved === 'D',
          isYoungAdult: resolved === 'E',
          ringNumber: auth.ringNumber() ?? null,
        };
      });
    },
  };
}
