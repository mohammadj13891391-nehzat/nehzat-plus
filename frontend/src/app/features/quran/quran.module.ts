import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { QuranListComponent } from './pages/surah-list/surah-list.component';
import { SurahDetailComponent } from './pages/surah-detail/surah-detail.component';
import { TajweedRulesComponent } from './pages/tajweed-rules/tajweed-rules.component';
import { StudentProgressComponent } from './pages/student-progress/student-progress.component';
import { RecitationLevelsComponent } from './pages/recitation-levels/recitation-levels.component';
import { QuranCurriculumComponent } from './pages/quran-curriculum/quran-curriculum.component';
import { QuranService } from './services/quran.service';
import { QURAN_ROUTES } from './quran.routes';

@NgModule({
  declarations: [
    QuranListComponent,
    SurahDetailComponent,
    TajweedRulesComponent,
    StudentProgressComponent,
    RecitationLevelsComponent,
    QuranCurriculumComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(QURAN_ROUTES),
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [QuranService]
})
export class QuranModule { }