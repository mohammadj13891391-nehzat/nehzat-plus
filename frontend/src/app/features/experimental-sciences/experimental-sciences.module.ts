import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { EXPERIMENTAL_SCIENCES_ROUTES } from './experimental-sciences.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(EXPERIMENTAL_SCIENCES_ROUTES)
  ]
})
export class ExperimentalSciencesModule { }
