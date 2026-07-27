import { Component, OnInit } from '@angular/core';
import { TajweedRule } from '../../services/quran.service';
import { QuranService } from '../../services/quran.service';

@Component({
  selector: 'app-tajweed-rules',
  template: `
    <div class="tajweed-container">
      <h2>قوانین تجوید</h2>
      <mat-card *ngFor="let rule of rules" class="rule-card">
        <mat-card-header>
          <mat-card-title>{{ rule.name }}</mat-card-title>
          <mat-card-subtitle>سطح: {{ rule.ruleLevel }}</mat-card-subtitle>
        </mat-card-header>
        <mat-card-content>
          <p>{{ rule.description }}</p>
          <p *ngIf="rule.exampleText"><strong>مثال:</strong> {{ rule.exampleText }}</p>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .tajweed-container { padding: 20px; }
    .rule-card { margin-bottom: 16px; }
  `]
})
export class TajweedRulesComponent implements OnInit {
  rules: TajweedRule[] = [];

  constructor(private quranService: QuranService) {}

  ngOnInit(): void {
    this.quranService.getTajweedRules().subscribe(data => this.rules = data);
  }
}