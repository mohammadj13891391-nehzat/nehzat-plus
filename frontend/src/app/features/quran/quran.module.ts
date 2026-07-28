import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { QURAN_ROUTES } from './quran.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(QURAN_ROUTES)
  ]
})
export class QuranModule { }