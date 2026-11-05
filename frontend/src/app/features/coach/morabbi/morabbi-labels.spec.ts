import {
  STATUS_LABELS,
  ROLE_LABELS,
  NOTIFICATION_TYPE_LABELS,
  statusLabel,
  roleLabel,
  notificationTypeLabel,
  parseJsonList,
  parseJsonRecord,
  formatDate
} from './morabbi-labels';

describe('morabbi-labels', () => {
  describe('statusLabel', () => {
    it('maps known statuses to Persian labels', () => {
      expect(statusLabel('DRAFT')).toBe('پیش‌نویس');
      expect(statusLabel('SUBMITTED')).toBe('ثبت‌شده');
      expect(statusLabel('UNDER_REVIEW')).toBe('در حال بررسی');
      expect(statusLabel('APPROVED')).toBe('تأییدشده');
      expect(statusLabel('RETURNED')).toBe('بازمگردانده‌شده');
    });

    it('falls back to the raw value for unknown statuses', () => {
      expect(statusLabel('WEIRD')).toBe('WEIRD');
    });

    it('returns an em dash for null/undefined/empty', () => {
      expect(statusLabel(null)).toBe('—');
      expect(statusLabel(undefined)).toBe('—');
      expect(statusLabel('')).toBe('—');
    });
  });

  describe('roleLabel', () => {
    it('maps known roles to Persian labels', () => {
      expect(roleLabel('admin')).toBe('مدیر سامانه');
      expect(roleLabel('manager')).toBe('مسئول مرکزی');
      expect(roleLabel('branch_manager')).toBe('مسئول شعبه');
      expect(roleLabel('coach')).toBe('مربی');
      expect(roleLabel('evaluator')).toBe('ارزیاب');
    });

    it('falls back to the raw value for unknown roles', () => {
      expect(roleLabel('nobody')).toBe('nobody');
    });

    it('returns an em dash for null/undefined', () => {
      expect(roleLabel(null)).toBe('—');
      expect(roleLabel(undefined)).toBe('—');
    });
  });

  describe('notificationTypeLabel', () => {
    it('maps known types', () => {
      expect(notificationTypeLabel('info')).toBe('اطلاع‌رسانی');
      expect(notificationTypeLabel('recognition')).toBe('تشویق');
      expect(notificationTypeLabel('report_returned')).toBe('بازگشت گزارش');
      expect(notificationTypeLabel('plan_returned')).toBe('بازگشت طرح درس');
      expect(notificationTypeLabel('evaluation_done')).toBe('ارزیابی انجام شد');
    });

    it('falls back to the raw type', () => {
      expect(notificationTypeLabel('custom_type')).toBe('custom_type');
    });
  });

  describe('parseJsonList', () => {
    it('parses a JSON array of strings', () => {
      expect(parseJsonList('["a","b"]')).toEqual(['a', 'b']);
    });

    it('stringifies non-string elements', () => {
      expect(parseJsonList('[1, {"x": 1}]')).toEqual(['1', '{"x":1}']);
    });

    it('returns [] for null/empty/invalid input', () => {
      expect(parseJsonList(null)).toEqual([]);
      expect(parseJsonList(undefined)).toEqual([]);
      expect(parseJsonList('not json')).toEqual([]);
    });

    it('returns [] when the root is not an array', () => {
      expect(parseJsonList('{"a": 1}')).toEqual([]);
      expect(parseJsonList('"str"')).toEqual([]);
    });
  });

  describe('parseJsonRecord', () => {
    it('parses a JSON object', () => {
      expect(parseJsonRecord('{"a": 1, "b": "x"}')).toEqual({ a: 1, b: 'x' });
    });

    it('returns {} for null/empty/invalid input', () => {
      expect(parseJsonRecord(null)).toEqual({});
      expect(parseJsonRecord(undefined)).toEqual({});
      expect(parseJsonRecord('nope')).toEqual({});
    });

    it('returns {} when the root is an array or primitive', () => {
      expect(parseJsonRecord('[1,2]')).toEqual({});
      expect(parseJsonRecord('42')).toEqual({});
    });
  });

  describe('formatDate', () => {
    it('formats a valid ISO date with the fa-IR locale', () => {
      const out = formatDate('2026-01-01T00:00:00Z');
      expect(out).not.toBe('—');
      expect(out.length).toBeGreaterThan(0);
    });

    it('returns the raw string when the date is invalid', () => {
      expect(formatDate('not-a-date')).toBe('not-a-date');
    });

    it('returns an em dash for null/undefined/empty', () => {
      expect(formatDate(null)).toBe('—');
      expect(formatDate(undefined)).toBe('—');
      expect(formatDate('')).toBe('—');
    });
  });

  it('label maps cover every documented key', () => {
    expect(Object.keys(STATUS_LABELS)).toHaveLength(5);
    expect(Object.keys(ROLE_LABELS)).toHaveLength(8);
    expect(Object.keys(NOTIFICATION_TYPE_LABELS)).toHaveLength(5);
  });
});
