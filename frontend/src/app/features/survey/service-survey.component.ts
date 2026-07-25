import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

interface SurveyResponse {
  role: string;
  parentName: string;
  parentPhone: string;
  childGrade: string;
  homeLocation: string;
  features: string;
  suggestions: string;
  date: string;
  time: string;
}

@Component({
  selector: 'app-service-survey',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="lp-page">
      <div class="lp-card" style="max-width: 900px; width: 100%;">
        <h1 class="lp-title">نظرسنجی سامانه «سرویس‌یاب»</h1>
        <p class="lp-subtitle">به منظور ارائه خدمات بهتر حمل‌ونقل متربیان، نظرات و نیازهای شما را در مورد سامانه هماهنگی والدین (سرویس‌یاب) 알려 بفرمایید</p>

        <!-- مرحله ۱: انتخاب نقش -->
        <div *ngIf="currentStep === 1" class="card">
          <div class="question-label">
            <span class="question-number">۱</span>
            <span>شما در سامانه سرویس‌یاب چه نقشی دارید؟</span>
          </div>
          <div class="role-accordion">
            <!-- بخش والدین متقاضی سرویس -->
            <div class="role-section">
              <button type="button" class="role-section-header" [attr.aria-expanded]="expanded1" (click)="toggleSection('1')">
                <span>🚗 والدین متقاضی سرویس (نیاز به حمل‌ونقل دارند)</span>
                <svg class="chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
              </button>
              <div class="role-section-body" *ngIf="expanded1">
                <div class="role-card" (click)="selectRole('متقاضی سرویس - پدر')">
                  <span class="icon">👨</span>
                  <div class="title">پدر (متقاضی سرویس)</div>
                  <div class="desc">پدر متربی که نیاز به سرویس صبح/عصر دارد</div>
                </div>
                <div class="role-card" (click)="selectRole('متقاضی سرویس - مادر')">
                  <span class="icon">👩</span>
                  <div class="title">مادر (متقاضی سرویس)</div>
                  <div class="desc">مادر متربی که نیاز به سرویس صبح/عصر دارد</div>
                </div>
              </div>
            </div>

            <!-- بخش والدین مالک ماشین -->
            <div class="role-section">
              <button type="button" class="role-section-header" [attr.aria-expanded]="expanded2" (click)="toggleSection('2')">
                <span>🚙 والدین مالک ماشین (می‌توانند بچه‌های دیگر را بیاورند/بدر برند)</span>
                <svg class="chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
              </button>
              <div class="role-section-body" *ngIf="expanded2">
                <div class="role-card" (click)="selectRole('مالک ماشین - پدر')">
                  <span class="icon">🚗</span>
                  <div class="title">پدر (مالک ماشین)</div>
                  <div class="desc">پدر متربی که ماشین شخصی دارد و می‌تواند بچه‌های دیگر را هم بیاورد/ببرد</div>
                </div>
                <div class="role-card" (click)="selectRole('مالک ماشین - مادر')">
                  <span class="icon">🚗</span>
                  <div class="title">مادر (مالک ماشین)</div>
                  <div class="desc">مادر متربی که ماشین شخصی دارد و می‌تواند بچه‌های دیگر را هم بیاورد/ببرد</div>
                </div>
              </div>
            </div>

            <!-- بخش مدیریت مدرسه -->
            <div class="role-section">
              <button type="button" class="role-section-header" [attr.aria-expanded]="expanded3" (click)="toggleSection('3')">
                <span>🏫 مدیریت و نظارت مدرسه</span>
                <svg class="chevron" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
              </button>
              <div class="role-section-body" *ngIf="expanded3">
                <div class="role-card" (click)="selectRole('مدیر مدرسه')">
                  <span class="icon">🏫</span>
                  <div class="title">مدیر مدرسه</div>
                  <div class="desc">نظارت بر سامانه و تصمیم‌گیری‌های کلان</div>
                </div>
                <div class="role-card" (click)="selectRole('معاونت فرهنگی/طلایی')">
                  <span class="icon">📋</span>
                  <div class="title">معاونت فرهنگی / طلایی</div>
                  <div class="desc">پیگیری امور متربیان و هماهنگی با والدین</div>
                </div>
                <div class="role-card" (click)="selectRole('معاونت اداری/مالی')">
                  <span class="icon">💼</span>
                  <div class="title">معاونت اداری / مالی</div>
                  <div class="desc">بررسی هزینه‌ها، قراردادها و پشتیبانی مالی</div>
                </div>
              </div>
            </div>
          </div>
          <div class="buttons">
            <button class="btn btn-primary" (click)="goStep2()" [disabled]="!selectedRole">مرحله بعد</button>
          </div>
        </div>

        <!-- مرحله ۲: اطلاعات پایه -->
        <div *ngIf="currentStep === 2" class="card">
          <div class="question-label">
            <span class="question-number">۲</span>
            <span>اطلاعات پایه (برای همگام‌سازی با سامانه)</span>
          </div>
          <div class="input-group">
            <div class="input-row">
              <div class="input-field">
                <label>نام و نام خانوادگی والد</label>
                <input type="text" [(ngModel)]="formData.parentName" placeholder="مثال: احمد محمدی">
              </div>
              <div class="input-field">
                <label>شماره تماس (واتس‌اپ/رابط)</label>
                <input type="tel" [(ngModel)]="formData.parentPhone" placeholder="مثال: 09123456789" pattern="^09\d{9}$">
              </div>
            </div>
            <div class="input-row">
              <div class="input-field">
                <label>کلاس/پایه فرزند</label>
                <select [(ngModel)]="formData.childGrade">
                  <option value="">انتخاب کنید</option>
                  <option *ngFor="let g of ['۱','۲','۳','۴','۵','۶','۷','۸','۹','۱۰','۱۱','۱۲']" [value]="g">{{ g }}</option>
                </select>
              </div>
              <div class="input-field">
                <label>محل سکونت (نقطه جمع/پذات)</label>
                <input type="text" [(ngModel)]="formData.homeLocation" placeholder="مثال: خیابان شهید بهشتی، کوچه ۳، پلاک ۱۲">
              </div>
            </div>
          </div>
          <div class="buttons">
            <button class="btn btn-secondary" (click)="goStep(1)">مرحله قبل</button>
            <button class="btn btn-primary" (click)="goStep3()">مرحله بعد</button>
          </div>
        </div>

        <!-- مرحله ۳: نیازها و اولویت‌ها -->
        <div *ngIf="currentStep === 3" class="card">
          <div class="question-label">
            <span class="question-number">۳</span>
            <span>{{ getStepTitle() }}</span>
          </div>
          <div class="options-list">
            <div class="option-item" *ngFor="let option of getOptions(); let i = index" (click)="toggleOption(i)">
              <div class="option-checkbox" [class.selected]="isOptionSelected(i)"></div>
              <span class="option-icon">{{ option.icon }}</span>
              <div>
                <div style="font-weight: 600;">{{ option.text }}</div>
                <div style="font-size: 0.85rem; color: #64748b;">{{ option.desc }}</div>
              </div>
            </div>
          </div>
          <div class="question-label" style="margin-top: 30px;">
            <span class="question-number">۴</span>
            <span>پیشنهادات، نگرانی‌ها یا نظرات دیگر:</span>
          </div>
          <textarea [(ngModel)]="formData.suggestions" placeholder="پیشنهادات خود را اینجا بنویسید..."></textarea>
          <div class="buttons">
            <button class="btn btn-secondary" (click)="goStep(2)">مرحله قبل</button>
            <button class="btn btn-success" (click)="submitForm()">ثبت نهایی</button>
          </div>
        </div>

        <!-- پیام موفقیت -->
        <div *ngIf="currentStep === 'success'" class="card">
          <div class="success-message">
            <span class="icon">✓</span>
            <h2>ثبت نظر شما با موفقیت انجام شد!</h2>
            <p>{{ successMessage }}</p>
            <button class="btn btn-primary" (click)="resetForm()">ثبت نظر جدید</button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./service-survey.component.scss']
})
export class ServiceSurveyComponent implements OnInit {
  currentStep = 1;
  selectedRole = '';
  expanded1 = true;
  expanded2 = true;
  expanded3 = true;

  formData: SurveyResponse = {
    role: '',
    parentName: '',
    parentPhone: '',
    childGrade: '',
    homeLocation: '',
    features: '',
    suggestions: '',
    date: '',
    time: ''
  };

  selectedFeatureIndices: number[] = [];
  submittedRoles: Set<string> = new Set();

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // بارگذاری نقش‌های ثبت‌شده از localStorage
    const saved = localStorage.getItem('serviceSurveySubmittedRoles');
    if (saved) {
      this.submittedRoles = new Set(JSON.parse(saved));
    }
    this.checkAllRolesDone();
  }

  selectRole(role: string): void {
    if (this.submittedRoles.has(role)) return;
    this.selectedRole = role;
    this.formData.role = role;
  }

  toggleSection(section: string): void {
    if (section === '1') this.expanded1 = !this.expanded1;
    else if (section === '2') this.expanded2 = !this.expanded2;
    else if (section === '3') this.expanded3 = !this.expanded3;
  }

  goStep(step: number | string): void {
    if (step === 2) {
      // اعتبارسنجی فیلدهای اجباری برای نقش‌های غیرمدیر
      if (!this.selectedRole) return;
      const isAdmin = this.selectedRole.includes('مدیر') || this.selectedRole.includes('معاونت');
      if (!isAdmin) {
        if (!this.formData.parentName || !this.formData.parentPhone || !this.formData.childGrade || !this.formData.homeLocation) {
          alert('لطفاً تمام فیلدهای اطلاعات پایه را پر کنید.');
          return;
        }
        if (!/^09\d{9}$/.test(this.formData.parentPhone)) {
          alert('شماره تماس معتبر نیست. فرمت: 09xxxxxxxxx');
          return;
        }
      }
    }

    this.currentStep = step;
    if (step === 2) this.updateProgress(2);
    else if (step === 3) this.updateProgress(3);
  }

  goStep2(): void {
    if (!this.selectedRole) return;
    this.goStep(2);
  }

  goStep3(): void {
    this.goStep(3);
  }

  getStepTitle(): string {
    const titles: { [key: string]: string } = {
      'متقاضی سرویس - پدر': 'چه امکانات و اولویت‌هایی برای شما مهم است؟',
      'متقاضی سرویس - مادر': 'چه امکانات و اولویت‌هایی برای شما مهم است؟',
      'مالک ماشین - پدر': 'چه شرایط و امکاناتی برای همکاری شما ضروری است؟',
      'مالک ماشین - مادر': 'چه شرایط و امکاناتی برای همکاری شما ضروری است؟',
      'مدیر مدرسه': 'چه قابلیت‌های مدیریتی برای شما اولویت دارد؟',
      'معاونت فرهنگی/طلایی': 'چه قابلیت‌های نظارتی برای شما اولویت دارد؟',
      'معاونت اداری/مالی': 'چه قابلیت‌های مالی/اداری برای شما اولویت دارد؟'
    };
    return titles[this.selectedRole] || 'کدام موارد برای شما اولویت دارد؟';
  }

  getOptions(): any[] {
    const optionsMap: { [key: string]: any[] } = {
      'متقاضی سرویس - پدر': [
        { icon: '🕐', text: 'سرویس صبح (ورود به مدرسه)', desc: 'بازیابی بچه از خانه و رسوندن به مدرسه' },
        { icon: '🕐', text: 'سرویس عصر (خروج از مدرسه)', desc: 'بازیابی بچه از مدرسه و رسوندن به خانه' },
        { icon: '🛡️', text: 'ایمنی و نظارت', desc: 'حضور ناظر/راننده قابل اعتماد در ماشین' },
        { icon: '💰', text: 'هزینه مناسب و شفاف', desc: 'تعرفه مشخص و بدون هزینه‌های پنهان' },
        { icon: '📍', text: 'نقطه جمع نزدیک خانه', desc: 'عدم نیاز به رفتن تا مکانی دور' },
        { icon: '🤝', text: 'هم‌سفر با بچه‌های آشنای هم‌سن', desc: 'آرامش روانی بچه در مسیر' },
        { icon: '📱', text: 'برنامه‌ریزی و اطلاع‌رسانی از طریق اپ/رابط', desc: 'دریافت اعلان ورود/خروج و تغییرات' }
      ],
      'متقاضی سرویس - مادر': [
        { icon: '🕐', text: 'سرویس صبح (ورود به مدرسه)', desc: 'بازیابی بچه از خانه و رسوندن به مدرسه' },
        { icon: '🕐', text: 'سرویس عصر (خروج از مدرسه)', desc: 'بازیابی بچه از مدرسه و رسوندن به خانه' },
        { icon: '🛡️', text: 'ایمنی و نظارت', desc: 'حضور ناظر/راننده قابل اعتماد در ماشین' },
        { icon: '💰', text: 'هزینه مناسب و شفاف', desc: 'تعرفه مشخص و بدون هزینه‌های پنهان' },
        { icon: '📍', text: 'نقطه جمع نزدیک خانه', desc: 'عدم نیاز به رفتن تا مکانی دور' },
        { icon: '🤝', text: 'هم‌سفر با بچه‌های آشنای هم‌سن', desc: 'آرامش روانی بچه در مسیر' },
        { icon: '📱', text: 'برنامه‌ریزی و اطلاع‌رسانی از طریق اپ/رابط', desc: 'دریافت اعلان ورود/خروج و تغییرات' }
      ],
      'مالک ماشین - پدر': [
        { icon: '💺', text: 'تعداد صندلی خالی (۱ تا ۳)', desc: 'چند بچه اضافه می‌توانم بیاورم/ببرد' },
        { icon: '🗓️', text: 'روزهای هفته (شنبه تا چهارشنبه)', desc: 'کدام روزها در دسترس هستم' },
        { icon: '⏰', text: 'بازه زمانی (فقط صبح / فقط عصر / هر دو)', desc: 'انعطاف در ساعات مراجعه' },
        { icon: '💰', text: 'مشارکت در هزینه سوخت/پارکینگ', desc: 'دریافت سهمی از هزینه از والدین دیگر' },
        { icon: '🛡️', text: 'بیمه سوار و مجوز کارمندی', desc: 'اطمینان از رعایت قوانین ایمنی' },
        { icon: '📍', text: 'مسیر ثابت و از پیش تعیین‌شده', desc: 'بدون تغییر مسیر ناگهانی' },
        { icon: '🤝', text: 'هماهنگی مستقیم با والدین دیگر', desc: 'گروه واتس‌اپ/رابط مخصوص هر ماشین' }
      ],
      'مالک ماشین - مادر': [
        { icon: '💺', text: 'تعداد صندلی خالی (۱ تا ۳)', desc: 'چند بچه اضافه می‌توانم بیاورم/ببرد' },
        { icon: '🗓️', text: 'روزهای هفته (شنبه تا چهارشنبه)', desc: 'کدام روزها در دسترس هستم' },
        { icon: '⏰', text: 'بازه زمانی (فقط صبح / فقط عصر / هر دو)', desc: 'انعطاف در ساعات مراجعه' },
        { icon: '💰', text: 'مشارکت در هزینه سوخت/پارکینگ', desc: 'دریافت سهمی از هزینه از والدین دیگر' },
        { icon: '🛡️', text: 'بیمه سوار و مجوز کارمندی', desc: 'اطمینان از رعایت قوانین ایمنی' },
        { icon: '📍', text: 'مسیر ثابت و از پیش تعیین‌شده', desc: 'بدون تغییر مسیر ناگهانی' },
        { icon: '🤝', text: 'هماهنگی مستقیم با والدین دیگر', desc: 'گروه واتس‌اپ/رابط مخصوص هر ماشین' }
      ],
      'مدیر مدرسه': [
        { icon: '📊', text: 'داشبورد نظارت و گزارش‌گیری', desc: 'مشاهده آمار استفاده، مسیریابی، و پوشش' },
        { icon: '🛡️', text: 'تأیید هویت و سوابق رانندگان', desc: 'سیستم احراز هویت و بررسی سوابق' },
        { icon: '📋', text: 'مدیریت قراردادها و تعرفه‌ها', desc: 'تنظیم و پایش قراردادهای خدماتی' },
        { icon: '🚨', text: 'سیستم هشدارها و مدیریت بحران', desc: 'اعلان تاخیر، تصادف، یا مشکلات ایمنی' },
        { icon: '👥', text: 'مدیریت والدین و متربیان', desc: 'لیست متقاضیان، مالکان ماشین، و تخصیص' },
        { icon: '📱', text: 'اپلیکیشن موبایل برای مدیریت', desc: 'دسترسی آفلاین/آنلاین به داشبورد' }
      ],
      'معاونت فرهنگی/طلایی': [
        { icon: '👥', text: 'مشاهده لیست متربیان بدون سرویس', desc: 'شناسایی متربیان نیازمند و اولویت‌بندی' },
        { icon: '🤝', text: 'هماهنگی با والدین و مشاوره', desc: 'ارتباط مستقیم برای حل چالش‌ها' },
        { icon: '📊', text: 'گزارش حضور/غیاب ناشی از حمل‌ونقل', desc: 'رصد تاخیرها و غیبت‌های مربوط به سرویس' },
        { icon: '📱', text: 'ارتباط سریع با رانندگان/ناظران', desc: 'ارسال اعلان‌های فوری' }
      ],
      'معاونت اداری/مالی': [
        { icon: '💰', text: 'مدیریت هزینه‌ها و تسویه حساب', desc: 'پرداخت به رانندگان، دریافت از والدین' },
        { icon: '📋', text: 'قراردادها و اسناد قانونی', desc: 'امضای الکترونیک، بایگانی، تمدید' },
        { icon: '📊', text: 'گزارش‌های مالی ماهانه/فصلی', desc: 'درآمد، هزینه، سود/زیان، ترازنامه' },
        { icon: '🛡️', text: 'بیمه و مسئولیت‌های حقوقی', desc: 'مدیریت פולیس‌های بیمه‌ای و دعاوی' }
      ]
    };
    return optionsMap[this.selectedRole] || [];
  }

  isOptionSelected(index: number): boolean {
    return this.selectedFeatureIndices.includes(index);
  }

  toggleOption(index: number): void {
    if (this.selectedFeatureIndices.includes(index)) {
      this.selectedFeatureIndices = this.selectedFeatureIndices.filter(i => i !== index);
    } else {
      this.selectedFeatureIndices.push(index);
    }
    this.formData.features = this.getSelectedFeatures().join('، ');
  }

  getSelectedFeatures(): string[] {
    return this.getOptions().filter((_, i) => this.selectedFeatureIndices.includes(i)).map(o => o.text);
  }

  updateProgress(step: number): void {
    const widths = { 1: '25%', 2: '50%', 3: '75%' };
    const element = document.querySelector('.progress-fill');
    if (element) element.style.width = widths[step] || '0%';
  }

  async submitForm(): Promise<void> {
    // اعتبارسنجی فیلدهای اجباری
    if (!this.selectedRole) {
      alert('لطفاً یک نقش انتخاب کنید.');
      return;
    }

    const isAdmin = this.selectedRole.includes('مدیر') || this.selectedRole.includes('معاونت');
    if (!isAdmin) {
      if (!this.formData.parentName || !this.formData.parentPhone || !this.formData.childGrade || !this.formData.homeLocation) {
        alert('لطفاً تمام فیلدهای اطلاعات پایه را پر کنید.');
        return;
      }
      if (!/^09\d{9}$/.test(this.formData.parentPhone)) {
        alert('شماره تماس معتبر نیست. فرمت: 09xxxxxxxxx');
        return;
      }
    }

    const currentDate = new Date();
    this.formData.date = currentDate.toLocaleDateString('fa-IR');
    this.formData.time = currentDate.toLocaleTimeString('fa-IR');

    // ذخیره در localStorage
    this.saveToLocalStorage();

    // ارسال به Google Sheets
    let sentOk = false;
    const GOOGLE_SHEET_URL = 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec';
    if (GOOGLE_SHEET_URL && GOOGLE_SHEET_URL !== 'https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec') {
      try {
        await this.http.post(GOOGLE_SHEET_URL, this.formData).toPromise();
        sentOk = true;
      } catch (e) {
        console.error('خطا در ارسال به Google Sheets:', e);
      }
    }

    // ذخیره وضعیت نقش
    this.submittedRoles.add(this.selectedRole);
    localStorage.setItem('serviceSurveySubmittedRoles', JSON.stringify(Array.from(this.submittedRoles)));

    this.checkAllRolesDone(sentOk);
  }

  saveToLocalStorage(): void {
    try {
      const key = 'serviceSurveyResponses';
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(this.formData);
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (e) {
      console.error('خطا در ذخیره localStorage:', e);
    }
  }

  checkAllRolesDone(sentOk?: boolean): void {
    const allRoles = [
      'متقاضی سرویس - پدر',
      'متقاضی سرویس - مادر',
      'مالک ماشین - پدر',
      'مالک ماشین - مادر',
      'مدیر مدرسه',
      'معاونت فرهنگی/طلایی',
      'معاونت اداری/مالی'
    ];

    const allDone = allRoles.every(r => this.submittedRoles.has(r));

    if (allDone) {
      this.currentStep = 'success';
      this.successMessage = 'شما در تمام نقش‌ها نظر خود را ثبت کرده‌اید';
      this.updateProgress(100);
    } else {
      this.currentStep = 'success';
      this.successMessage = sentOk
        ? 'نظر شما با موفقیت ثبت شد! می‌توانید در نقش دیگری نیز نظر دهید.'
        : 'نظر شما ثبت شد (ذخیره محلی). می‌توانید در نقش دیگری نیز نظر دهید.';
      this.updateProgress(100);
    }
  }

  resetForm(): void {
    this.currentStep = 1;\n    this.selectedRole = '';
    this.formData = {
      role: '',
      parentName: '',
      parentPhone: '',
      childGrade: '',
      homeLocation: '',
      features: '',
      suggestions: '',
      date: '',
      time: ''
    };
    this.selectedFeatureIndices = [];
    this.submittedRoles.clear();
    localStorage.removeItem('serviceSurveySubmittedRoles');
    localStorage.removeItem('serviceSurveyResponses');
    this.updateProgress(0);
  }
}
