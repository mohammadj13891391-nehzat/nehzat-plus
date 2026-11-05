import { Component } from '@angular/core';
import { SpiritualShellComponent } from '../shared/spiritual-shell/spiritual-shell.component';

@Component({
  standalone: true,
  imports: [SpiritualShellComponent],
  template: '<app-spiritual-shell [hideHeader]="true" />'
})
export class CoachSpiritualPageComponent {}
