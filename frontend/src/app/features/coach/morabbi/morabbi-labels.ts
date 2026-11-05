export const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'پیش‌نویس',
  SUBMITTED: 'ثبت‌شده',
  UNDER_REVIEW: 'در حال بررسی',
  APPROVED: 'تأییدشده',
  RETURNED: 'بازمگردانده‌شده'
};

export const ROLE_LABELS: Record<string, string> = {
  admin: 'مدیر سامانه',
  manager: 'مسئول مرکزی',
  branch_manager: 'مسئول شعبه',
  coach: 'مربی',
  instructor_assistant: 'دستیار مربی',
  evaluator: 'ارزیاب',
  brothers_skills_supervisor: 'سرپرست مهارت‌های برادران',
  sisters_skills_supervisor: 'سرپرست مهارت‌های خواهران'
};

export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  info: 'اطلاع‌رسانی',
  recognition: 'تشویق',
  report_returned: 'بازگشت گزارش',
  plan_returned: 'بازگشت طرح درس',
  evaluation_done: 'ارزیابی انجام شد'
};

export function statusLabel(status: string | null | undefined): string {
  if (!status) return '—';
  return STATUS_LABELS[status] ?? status;
}

export function roleLabel(role: string | null | undefined): string {
  if (!role) return '—';
  return ROLE_LABELS[role] ?? role;
}

export function notificationTypeLabel(type: string): string {
  return NOTIFICATION_TYPE_LABELS[type] ?? type;
}

export function parseJsonList(raw: string | null | undefined): string[] {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    if (Array.isArray(v)) return v.map((x) => (typeof x === 'string' ? x : JSON.stringify(x)));
    return [];
  } catch {
    return [];
  }
}

export function parseJsonRecord(raw: string | null | undefined): Record<string, unknown> {
  if (!raw) return {};
  try {
    const v = JSON.parse(raw);
    if (v && typeof v === 'object' && !Array.isArray(v)) return v as Record<string, unknown>;
    return {};
  } catch {
    return {};
  }
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('fa-IR');
}
