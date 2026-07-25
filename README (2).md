# 🌀 اسکیل مدل رایگان — خط لولهٔ HA چندمدلی زن

## خلاصهٔ سریع

یک خط لولهٔ چندمدلی از مدل‌های ابری رایگان OpenCode که شش مدل تخصصی را به‌صورت خودکار، بدون قطعی و با حفظ کامل زمینه، در یک گفتگو کنار هم اجرا می‌کند. وقتی یک مدل قطع می‌شود، مدل بعدی فوراً جایگزین می‌شود و پروژه هرگز متوقف نمی‌شود.

---

## 🤖 مدل‌های رایگان

همه از **OpenCode Zen** — بدون کارت اعتباری، بدون API Key جداگانه. فقط یک بار `opencode auth login` کافی است.

| شماره | شناسه مدل | نام | Context | تخصص |
|---|---|---|---|---|
| ۱ | `ling-3.0-flash-free` | **Ling 3.0 Flash رایگان** | ۱M | **اصلی — استدلال سریع** |
| ۲ | `big-pickle` | Big Pickle | ۲۰۰K | تست سریع، چک اتصال |
| ۳ | `deepseek-v4-flash-free` | DeepSeek V4 Flash | ۱M | استدلال عمیق، کدنویسی |
| ۴ | `mimo-v2.5-free` | MiMo V2.5 | ۱M | بررسی کد، امنیت، دیداری |
| ۵ | `nemotron-3-ultra-free` | Nemotron 3 Ultra | ۱M | برنامه‌ریزی، ارکستراسیون |
| ۶ | `north-mini-code-free` | North Mini Code | ۲۵۶K | کدنویسی عامل‌گرا، ترمینال |
| ۷ | `hy3-free` | Hy3 Preview | ۲۵۶K | بررسی type، schema |

> **نکته:** هر مدل رایگان جدید که در `opencode.jsonc` زیر `provider.zen.models` اضافه شود، **خودکار** به خط لوله ملحق می‌شود. نیازی به تغییر کد نیست.

---

## 🔄 چرخهٔ Failover (جایگزینی خودکار)

```
LING 3.0 ◀══════════════════════════════════▶
      │                                          │
      ▼                                          │
  BIG PICKLE ──▶ DEEPSEEK V4 ──▶ NEMOTRON 3 ──▶
      │                    │                  │
      │                    ▼                  │
      │              NORTH MINI ◀─────────────┘
      │                    │
      │                    ▼
      │              MIMO V2.5 (بررسی امنیتی)
      │                    │
      │                    ▼
      │              HY3 PREVIEW (بازرسی نوع)
      │                    │
      │                    ▼
      └──────── BIG PICKLE ────▶ ✅ PASS → حلقهٔ بعدی
      (قطره چک نهایی)
```

### قوانین:
- وقتی یک مدل قطع شد → **مدل بعدی فوراً** جایگزین می‌شود
- Context کامل بین مدل‌ها **حفظ** می‌شود
- بعد از مدل آخر → **برگشت به LING 3.0** (حلقهٔ بی‌نهایت)
- پروژه **هرگز** متوقف نمی‌شود

---

## 📦 ساختار پوشه

```
اسکیل مدل رایگان/
├── README.md                    ← این فایل (راهنمای کامل)
├── opencode.jsonc               ← پیکربندی مدل‌های Zen
├── zen-ha-pipeline.ts           ← اسکریپت اجرای HA Failover
├── zen-commands.md             ← دستورات اسلش
└── docs/
    └── SKILL.md                 ← دستورالعمل اسکیل OpenCode
```

---

## 🚀 راه‌اندازی (۳ دقیقه)

### مرحله ۱: نصب بسته‌ها
```powershell
# در پوشه پروژه
cd D:\nehzat-plus\motafaregheh\.opencode
bun install
```

### مرحله ۲: پیکربندی
```powershell
# پیکربندی سراسری (توصیه شده — برای تمام پروژه‌ها):
Copy-Item "D:\nehzat-plus\Abzar\اسکیل مدل رایگان\opencode.jsonc" "$env:USERPROFILE\.config\opencode\opencode.jsonc" -Force

# یا پیکربندی محلی فقط این پروژه:
Copy-Item "D:\nehzat-plus\Abzar\اسکیل مدل رایگان\opencode.jsonc" "D:\nehzat-plus\motafaregheh\opencode.jsonc" -Force
```

### مرحله ۳: احراز هویت (یک‌بار در هر سیستم)
```powershell
opencode auth login
```
در منوی ظاهر شده:
1. **OpenCode Zen** را انتخاب کنید
2. **Anonymous / Zen Gateway** را انتخاب کنید
3. مرورگر باز می‌شود — با حساب گوگل تأیید کنید

### مرحله ۴: اجرا
```powershell
# با اسکریپت HA Failover:
bun D:\nehzat-plus\motafaregheh\zen-ha-pipeline.ts "Your task here"

# یا در OpenCode TUI:
opencode
# سپس بنویسید:
/zen-pipeline "Your task here"

# یا فقط در chat تایپ کنید:
# "یک REST API با JWT احراز هویت بنویس"
# ← خط لوله خودکار شروع می‌شود!
```

### دستورات مفید دیگر:
```powershell
# ادامه از نقطه‌ای که قطع شده
bun zen-ha-pipeline.ts --resume

# نمایش وضعیت فعلی
bun zen-ha-pipeline.ts --status

# اجرای مرحلهٔ خاص
bun zen-ha-pipeline.ts --stage analyze "my task"

# کمک
bun zen-ha-pipeline.ts --help
```

---

## 📖 مراحل خط لوله

### مرحله ۱ — LING 3.0 Flash (تحلیل)
درخواست شما را تحلیل می‌کند، رویکرد و طراحی اولیه را می‌نویسد.
خروجی: تحلیل ساختاری + پیش‌نویس

### مرحله ۲ — BIG PICKLE (آماده‌سازی)
تست ساده اتصال و sanity check انجام می‌دهد.
خروجی: تأیید آماده بودن

### مرحله ۳ — DEEPSEEK V4 FLASH (طراحی)
معماری عمیق طراحی می‌کند، فایل‌ها و وابستگی‌ها را شناسایی می‌کند.
خروجی: برنامهٔ اجرایی کامل

### مرحله ۴ — NEMOTRON 3 ULTRA (ارکستراسیون)
برنامه را به subtask‌های مرتب تقسیم می‌کند، edge cases و error handlers را اضافه می‌کند.
خروجی: لیست task‌های مرتب با مسیر فایل‌ها

### مرحله ۵ — NORTH MINI CODE (پیاده‌سازی)
کد واقعی را می‌نویسد، تست‌ها را اجرا می‌کند، خطاهای build را رفع می‌کند.
خروجی: کد کارآمد + نتایج تست

### مرحله ۶ — MIMO V2.5 (بررسی امنیتی)
کد جدید را بررسی می‌کند، security vulnerabilities را پیدا می‌کند، بهبودهای کیفی پیشنهاد می‌دهد.
خروجی: گزارش بررسی + رموز اصلاح‌شده

### مرحله ۷ — HY3 PREVIEW (بازرسی ساختار)
types را بررسی می‌کند، JSON schemas را تأیید می‌کند، فراخوانی‌های ابزار صحت می‌شود.
خروجی: گزارش بازرسی ساختار

### مرحله ۸ — BIG PICKLE (تست نهایی)
smoke test یک‌خطی انجام می‌دهد.
خروجی: ✅ PASS / ❌ FAIL

**بعد از PASS → برگشت به مرحله ۱ (حلقهٔ بعدی)**

---

## 💻 مثال عملی

### شما تایپ می‌کنید:
```
"یک middleware برای احراز هویت JWT با refresh token بنویس"
```

### خط لوله به‌صورت خودکار اجرا می‌شود:

```
🔄 LING 3.0 → تحلیل →
  "ساختار middleware را طراحی می‌کنیم:
   - middleware.ts: احراز توکن
   - refresh.ts: تازه‌سازی توکن
   - auth.types.ts: interface ها
   - test/auth.test.ts: تست‌ها

🔄 NEMOTRON 3 → تقسیم task به subtask‌های مرتب
  ...

🔄 NORTH MINI CODE → پیاده‌سازی → فایل‌ها نوشته می‌شوند
  ...

🔄 MIMO V2.5 → بررسی →
  "rate limiting اضافه کن، timeout در refresh endpoint"
  ...

🔄 HY3 PREVIEW → تأیید نوع → ✅ ok

🔄 BIG PICKLE → smoke test → ✅ PASS

✅ RESULT: برگشت به شما با کد کامل، تست‌شده و بررسی‌شده
```

---

## 🔧 عیب‌یابی

| مشکل | راه‌حل |
|---|---|
| "Model not found" | `opencode auth login` → OpenCode Zen انتخاب کنید |
| Rate limited | ۳۰ ثانیه صبر کنید — Tier رایگان محدودیت‌های generous دارد |
| قطعی در میان | `bun zen-ha-pipeline.ts --resume` از همین‌جا ادامه می‌دهد |
| مدل جدید اضافه شد | فقط کافی است در `opencode.jsonc` اضافه کنید → خودکار |

---

## ✅ چک‌لیست سریع

- [ ] پوشه را کپی کنید در هر سیستمی که خواستید
- [ ] `opencode.jsonc` را در پروژه خود قرار دهید
- [ ] `bun install` در پوشهٔ پروژه
- [ ] `opencode auth login` (یک‌بار در هر سیستم)
- [ ] `bun zen-ha-pipeline.ts "task"` یا `opencode` → `/zen-pipeline`

**تمام! 🎉**

---

## 📝 مجوز

MIT — آزاد برای استفاده، تغییر و توزیع.