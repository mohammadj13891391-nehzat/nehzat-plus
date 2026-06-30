import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';
import { environment } from '../../../environments/environment';

import { LessonPlannerApi } from './lesson-planner-api.interface';
import { HttpLessonPlannerApi } from './http-lesson-planner-api.service';

export const LESSON_PLANNER_API = new InjectionToken<LessonPlannerApi>('LESSON_PLANNER_API');

export function provideLessonPlannerApi(): EnvironmentProviders {
  return makeEnvironmentProviders([
    {
      provide: LESSON_PLANNER_API,
      useClass: HttpLessonPlannerApi
    }
  ]);
}
