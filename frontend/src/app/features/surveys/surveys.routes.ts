import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { SurveyListComponent } from '../shared/surveys/survey-list.component';
import { SurveyTakerComponent } from '../shared/surveys/survey-taker.component';

export const SURVEYS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: SurveyListComponent,
  },
  {
    path: 'take/:id',
    canActivate: [authGuard],
    component: SurveyTakerComponent,
  },
];
