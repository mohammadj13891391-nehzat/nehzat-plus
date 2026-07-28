import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuranService } from '../../services/quran.service';

@Component({
  selector: 'app-lesson-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lesson-plans.component.html',
  styleUrls: ['./lesson-plans.component.scss']
})
export class LessonPlansComponent implements OnInit {
  plans: string[] = [];
  selectedPlan: string | null = null;
  planContent = '';
  _loading = signal(true);
  _error = signal<string | null>(null);

  constructor(private quranService: QuranService) {}

  ngOnInit(): void {
    this._loading.set(true);
    this.quranService.getQuranLessonPlans().subscribe({
      next: (data) => { this.plans = data; this._loading.set(false); },
      error: () => { this._error.set('خطا در بارگذاری برنامه‌های درسی'); this._loading.set(false); }
    });
  }

  selectPlan(name: string): void {
    this.selectedPlan = name;
    this.planContent = '';
    this.quranService.getQuranLessonPlanById(name as any).subscribe({
      next: (data) => { this.planContent = data; },
      error: () => { this.planContent = 'خطا در بارگذاری محتوا'; }
    });
  }

  getPlanEmoji(name: string): string {
    const emojis: Record<string, string> = { 'F1': '🧒', 'F2': '📚', 'F3': '🎤', 'F4': '🧠', 'F5': '⏰', 'F6': '🏫', 'F7': '📋', 'F8': '📄' };
    return emojis[name.substring(0, 2)] || '📖';
  }

  getPlanTitle(name: string): string {
    const titles: Record<string, string> = {
      'F1-sensory-materials-ages5-7': 'فاز ۱: آموزش حسی (۵-۷ سال)',
      'F2-language-textbooks-ages7-14': 'فاز ۲: کتاب‌های زبان (۷-۱۴ سال)',
      'F3-recitation-workbooks-ages10-18': 'فاز ۳: کارگاه تلاوت (۱۰-۱۸ سال)',
      'F4-deep-modules-ages14-21': 'فاز ۴: ماژول‌های عمیق (۱۴-۲۱ سال)',
      'F5-timetables': 'برنامه‌های زمانی',
      'F6-methodology-guide': 'راهنمای روش‌شناسی',
      'F7-assessment-framework': 'چارچوب ارزیابی',
      'F8-complete-documentation': 'مستندات کامل پروژه'
    };
    return titles[name] || name;
  }

  getPlanSubtitle(name: string): string {
    const titles: Record<string, string> = {
      'F1-sensory-materials-ages5-7': 'تشخیص حروف، اعداد و آشنایی حسی با قرآن',
      'F2-language-textbooks-ages7-14': 'صرف، نحو، اشتقاق و بلاغت',
      'F3-recitation-workbooks-ages10-18': 'روخوانی، تجوید و قرائت',
      'F4-deep-modules-ages14-21': 'تدبر، تفسیر و علوم قرآنی',
      'F5-timetables': 'برنامه روزانه، هفتگی و سالانه',
      'F6-methodology-guide': 'روش‌های تدریس برای هر گروه سنی',
      'F7-assessment-framework': 'آزمون‌ها و ارزیابی پیشرفت',
      'F8-complete-documentation': 'خلاصه کامل پروژه و مستندات'
    };
    return titles[name] || '';
  }
}