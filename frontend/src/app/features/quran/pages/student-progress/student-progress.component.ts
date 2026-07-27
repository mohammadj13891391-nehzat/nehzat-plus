import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { QuranStudentProgress } from '../../services/quran.service';
import { QuranService } from '../../services/quran.service';

@Component({
  selector: 'app-student-progress',
  template: `
    <div class="progress-container">
      <h2>پیشرفت دانشجو</h2>
      <mat-progress-bar mode="determinate" [value]="overallProgress"></mat-progress-bar>
      <p>پیشرفت کلی: {{ overallProgress }}%</p>
      <mat-table [dataSource]="progresses" class="mat-elevation-z8">
        <ng-container matColumnDef="surah">
          <th mat-header-cell *matHeaderCellDef>سوره</th>
          <td mat-cell *matCellDef="let p">{{ p.surah?.name }}</td>
        </ng-container>
        <ng-container matColumnDef="percentage">
          <th mat-header-cell *matHeaderCellDef>درصد</th>
          <td mat-cell *matCellDef="let p">{{ p.percentage }}%</td>
        </ng-container>
        <ng-container matColumnDef="notes">
          <th mat-header-cell *matHeaderCellDef>توضیحات</th>
          <td mat-cell *matCellDef="let p">{{ p.notes }}</td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
        <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
      </mat-table>
    </div>
  `,
  styles: [`
    .progress-container { padding: 20px; }
    mat-table { width: 100%; margin-top: 20px; }
  `]
})
export class StudentProgressComponent implements OnInit {
  progresses: QuranStudentProgress[] = [];
  overallProgress = 0;
  displayedColumns = ['surah', 'percentage', 'notes'];

  constructor(
    private route: ActivatedRoute,
    private quranService: QuranService
  ) {}

  ngOnInit(): void {
    const studentId = Number(this.route.snapshot.paramMap.get('studentId'));
    this.quranService.getStudentProgress(studentId).subscribe(data => {
      this.progresses = data;
      if (data.length > 0) {
        this.overallProgress = Math.round(data.reduce((sum, p) => sum + p.percentage, 0) / data.length);
      }
    });
  }
}