import { Routes } from '@angular/router';
import { serviceSurveyGuard } from './service-survey.guard';
import { authGuard } from './core/guards/auth.guard';

export const SERVICE_SURVEY_ROUTES: Routes = [
  {
    path: '',
    component: ServiceSurveyComponent,
    canActivate: [authGuard, serviceSurveyGuard]
  }
];