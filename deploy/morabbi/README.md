# استقرار Morabbi روی VPS

توپولوژی: **Caddy (443/80)** ← `127.0.0.1:3010` (API ASP.NET Core) + `file_server` برای SPA.

```
/opt/morabbi/
├── api/              # خروجی dotnet publish
├── web/              # خروجی ng build (dist/.../browser)
├── backups/          # بکاپ‌های روزانه SQL Server
├── logs/
├── morabbi.env       # رمزها (chmod 600)
├── api.tar.gz        # گذینا — توسط update.sh مصرف می‌شود
└── web.tar.gz        # گذینا — توسط update.sh مصرف می‌شود
```

## ۱. نصب اولیه (رونده VPS)

اسکریپت‌ها را یک‌بار کپی کنید:

```bash
scp -r deploy/morabbi/scripts deploy/morabbi/caddy deploy/morabbi/systemd user@vps:/tmp/morabbi-deploy/
ssh user@vps
sudo DOMAIN=morabbi.nehzat128.ir EMAIL=ops@example.ir bash /tmp/morabbi-deploy/scripts/deploy.sh
```

deploy.sh این کارها را انجام می‌دهد: نصب .NET 10 Runtime + Caddy + sqlcmd، ساخت کاربر `morabbi` و پوشه‌ها،
نویسی `/etc/caddy/Caddyfile` (HTTPS خودکار Let's Encrypt)، نصب unit `morabbi-api.service`
(hardened: `ProtectSystem=strict`, `PrivateTmp`, `NoNewPrivileges`) و استارت سرویس‌ها.

سپس **حتما** مقادیر واقعی را در `/opt/morabbi/morabbi.env` پر کنید:

| متغیر | توضیح |
|---|---|
| `ConnectionStrings__DefaultConnection` | رشته اتصال SQL Server (پایگاه `Morabbi`) |
| `LocalAuth__Secret` | کلید HMAC حداقل ۳۲ کاراکتر (برای `/api/auth/local`) |
| `NehzatHub__Key` | کلید درون‌شبکه‌ای برای پل رویدادها (اختیاری) |
| `MORABBI_SQL_HOST/USER/PASS` | ورودی‌های backup.sh |

## ۲. بیلد و آپدیت (مهریه)

```bash
# API — از سورس D:\morabbi
cd D:\morabbi\backend\src\EducationalPlatform.Morabbi.API
dotnet publish -c Release -o publish
tar -czf morabbi-api.tar.gz -C publish .

# Web — فرانت مستقل Morabbi
cd D:\morabbi\frontend
npm ci && npm run build
tar -czf morabbi-web.tar.gz -C dist/morabbi-frontend/browser .

# انتقال + آپدیت
scp morabbi-api.tar.gz morabbi-web.tar.gz user@vps:/opt/morabbi/
ssh user@vps "cd /opt/morabbi && sudo bash /tmp/morabbi-deploy/scripts/update.sh"
```

`update.sh` health-gate دارد: بعد از سواپ، تا ۳۰ ثانیه `/api/health` را چک می‌کند؛
اگر ناسالم بود **خودکار rollback** می‌کند و با `exit 1` می‌رود.

## ۳. بکاپ روزانه

```bash
mkdir -p /var/log
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/morabbi/scripts/backup.sh >> /var/log/morabbi-backup.log 2>&1") | crontab -
```

نگهداری: ۳۰ روز. خروجی: `/opt/morabbi/backups/morabbi_Morabbi_YYYYmmdd_HHMMSS.bak`

## ۴. عیب‌یابی

```bash
sudo journalctl -u morabbi-api -n 100 --no-pager   # لاگ API
sudo journalctl -u caddy -n 50 --no-pager          # لاگ Caddy
curl -fsS http://127.0.0.1:3010/api/health         # سلامت API
sudo caddy validate --config /etc/caddy/Caddyfile  # اعتبار Caddyfile
```

نکات:
- دامنه باید به VPS اشاره کند (DNS A record) تا Let's Encrypt کار کند.
- CORS بکند روی `https://<domain>` تنظیم است (بخش `Cors:AllowedOrigins` در appsettings).
- اگر SPA از همین دامنه سرو شود (پیشنهادی)، پیکربندی جداگانه لازم نیست.
