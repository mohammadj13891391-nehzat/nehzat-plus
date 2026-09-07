import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedHeaderComponent } from './header/header.component';

@NgModule({
  imports: [SharedHeaderComponent],
  exports: [SharedHeaderComponent],
})
export class SharedModule {}