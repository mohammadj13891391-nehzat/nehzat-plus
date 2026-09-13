import { Route } from '@angular/router';
import { LearningPathComponent } from './pages/learning-path.component';
import { LessonDetailPageComponent } from './pages/lesson-detail-page.component';

export default [
  { path: '', component: LearningPathComponent },
  { path: 'lesson/:id', component: LessonDetailPageComponent }
] as Route[];
