import { CommonModule } from '@angular/common';
import { Component, forwardRef, Input, OnDestroy, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { Jalali } from 'jalali-ts';
import { IActiveDate, IDatepickerTheme, NgPersianDatepickerModule } from 'ng-persian-datepicker';

Jalali.checkTimeZone = false;

const THEME: Partial<IDatepickerTheme> = {
  border: 'var(--lp-border, #d8d0c2)',
  timeBorder: 'var(--lp-border, #d8d0c2)',
  background: 'var(--surface, #ffffff)',
  text: 'var(--text, #1e1b14)',
  hoverBackground: 'var(--gold-light, #f7f1e3)',
  hoverText: 'var(--text, #1e1b14)',
  disabledBackground: '#f5f5f5',
  disabledText: '#9ca3af',
  selectedBackground: 'var(--lp-primary, #1a6b3c)',
  selectedText: '#ffffff',
  todayBackground: 'var(--gold, #b8942e)',
  todayText: '#ffffff',
  otherMonthBackground: 'transparent',
  otherMonthText: 'var(--lp-muted, #8c857a)',
};

@Component({
  selector: 'app-persian-date-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, NgPersianDatepickerModule],
  template: `
    <ng-persian-datepicker
      class="persian-date-picker"
      [dateValue]="displayControl"
      dateFormat="YYYY/MM/DD"
      dateGregorianFormat="YYYY-MM-DD"
      [uiTheme]="theme"
      [uiHideAfterSelectDate]="true"
      [uiHideOnOutsideClick]="true"
      [uiYearView]="true"
      [uiMonthView]="true"
      [uiTodayBtnEnable]="true"
      (dateOnSelect)="onDateSelect($event)"
    >
      <input
        type="text"
        class="form-input persian-date-input"
        [formControl]="displayControl"
        [placeholder]="placeholder"
        [attr.aria-label]="ariaLabel"
        autocomplete="off"
        inputmode="numeric"
        (blur)="onBlur()"
      />
    </ng-persian-datepicker>
  `,
  styleUrls: ['./persian-date-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PersianDateInputComponent),
      multi: true,
    },
  ],
})
export class PersianDateInputComponent implements ControlValueAccessor, OnDestroy {
  private readonly destroyRef = inject(DestroyRef);

  @Input() placeholder = 'تاریخ را انتخاب کنید';
  @Input() ariaLabel = '';

  readonly theme = THEME;
  readonly displayControl = new FormControl<string>('', { nonNullable: true });

  private onChange: (value: string) => void = () => void 0;
  private onTouched: () => void = () => void 0;
  private isWritingValue = false;

  constructor() {
    this.displayControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        if (this.isWritingValue) return;
        this.emitIsoFromDisplay(value);
      });
  }

  writeValue(isoDate: string | null | undefined): void {
    this.isWritingValue = true;
    const displayValue = isoDate ? this.toJalaliDisplay(isoDate) : '';
    this.displayControl.setValue(displayValue, { emitEvent: false });
    this.isWritingValue = false;
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.displayControl.disable({ emitEvent: false });
    } else {
      this.displayControl.enable({ emitEvent: false });
    }
  }

  onDateSelect(event: IActiveDate): void {
    this.onChange(event.gregorian);
    this.onTouched();
  }

  onBlur(): void {
    this.onTouched();
  }

  private emitIsoFromDisplay(value: string): void {
    if (!value || !value.trim()) {
      this.onChange('');
      this.onTouched();
      return;
    }

    try {
      const iso = Jalali.parse(value).gregorian('YYYY-MM-DD');
      this.onChange(iso);
    } catch {
      // Ignore invalid partial input while user is typing.
    }
  }

  private toJalaliDisplay(isoDate: string): string {
    try {
      return Jalali.gregorian(isoDate).format('YYYY/MM/DD');
    } catch {
      return isoDate;
    }
  }

  ngOnDestroy(): void {
    // takeUntilDestroyed handles subscription cleanup.
  }
}
