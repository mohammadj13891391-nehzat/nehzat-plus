import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const STORAGE_KEY = 'lp_phase_override';
const PHASES = ['A', 'B', 'C', 'D', 'E'] as const;
type Phase = (typeof PHASES)[number];

@Component({
  selector: 'app-phase-switcher',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="phase-switcher" dir="rtl">
      <label class="phase-switcher__label" for="phase-select">فاز (تست):</label>
      <select
        id="phase-select"
        class="phase-switcher__select"
        [value]="selected()"
        (change)="onChange($event)"
      >
        <option value="">واقعی (DoB)</option>
        <option *ngFor="let p of phases" [value]="p">فاز {{ p }}</option>
      </select>
    </div>
  `,
  styles: [
    `
      .phase-switcher {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
      }
      .phase-switcher__label {
        font-size: 0.75rem;
        color: var(--lp-text-secondary, #666);
      }
      .phase-switcher__select {
        font-size: 0.85rem;
        padding: 0.25rem 0.5rem;
        border: 1px solid var(--lp-border, #ddd);
        border-radius: 6px;
        background: var(--lp-surface, #fff);
        color: var(--lp-text, #222);
      }
    `,
  ],
})
export class PhaseSwitcherComponent {
  readonly phases = PHASES;
  readonly selected = signal<Phase | ''>(this.readStored());

  onChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as Phase | '';
    if (value) {
      localStorage.setItem(STORAGE_KEY, value);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    window.location.reload();
  }

  private readStored(): Phase | '' {
    const v = localStorage.getItem(STORAGE_KEY);
    return v && (PHASES as readonly string[]).includes(v) ? (v as Phase) : '';
  }
}
