import { Routes } from '@angular/router';
import { serviceSurveyGuard } from '../../core/guards/service-survey.guard';
import { SurveyRespondComponent } from './survey-respond.component';
import { SurveyManageComponent } from './survey-manage.component';
import { SurveyAnalyticsComponent } from './survey-analytics.component';
import { SurveyFinancialComponent } from './survey-financial.component';

export const SURVEY_ROUTES: Routes = [
  {
    path: '',
    canActivate: [serviceSurveyGuard],
    redirectTo: 'respond',
    pathMatch: 'full',
  },
  {
    path: 'respond',
    canActivate: [serviceSurveyGuard],
    component: SurveyRespondComponent,
  },
  {
    path: 'manage',
    canActivate: [serviceSurveyGuard],
    component: SurveyManageComponent,
  },
  {
    path: 'analytics',
    canActivate: [serviceSurveyGuard],
    component: SurveyAnalyticsComponent,
  },
  {
    path: 'financial',
    canActivate: [serviceSurveyGuard],
    component: SurveyFinancialComponent,
  },
];
