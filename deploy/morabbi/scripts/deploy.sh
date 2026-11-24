#!/usr/bin/env bash
# One-time server setup for Morabbi (ASP.NET Core API on :3010 + Angular SPA behind Caddy).
# Usage on the VPS:  sudo DOMAIN=morabbi.nehzat128.ir EMAIL=ops@example.ir bash deploy.sh
set -euo pipefail

DOMAIN="${DOMAIN:?set DOMAIN, e.g. DOMAIN=morabbi.nehzat128.ir}"
EMAIL="${EMAIL:?set EMAIL for Let's Encrypt, e.g. EMAIL=ops@example.ir}"
INSTALL_DIR=/opt/morabbi
DOTNET_CHANNEL=10.0
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log() { echo "[deploy] $*"; }

id -u morabbi >/dev/null 2>&1 || useradd --system --home-dir "$INSTALL_DIR" --shell /usr/sbin/nologin morabbi
mkdir -p "$INSTALL_DIR"/{api,web,backups,logs}

if ! command -v dotnet >/dev/null 2>&1; then
  log "installing .NET ${DOTNET_CHANNEL} runtime"
  curl -fsSL https://dot.net/v1/dotnet-install.sh -o /tmp/dotnet-install.sh
  bash /tmp/dotnet-install.sh --channel "$DOTNET_CHANNEL" --runtime dotnet --install-dir /usr/local/share/dotnet
  ln -sf /usr/local/share/dotnet/dotnet /usr/local/bin/dotnet
fi
export DOTNET_ROOT=/usr/local/share/dotnet
log "dotnet: $(dotnet --version)"

if ! command -v caddy >/dev/null 2>&1; then
  log "installing Caddy"
  apt-get update -y
  apt-get install -y caddy
fi
log "caddy: $(caddy version)"

if ! command -v sqlcmd >/dev/null 2>&1; then
  log "installing sqlcmd (mssql-tools18)"
  curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /usr/share/keyrings/microsoft.gpg
  echo "deb [signed-by=/usr/share/keyrings/microsoft.gpg] https://packages.microsoft.com/config/ubuntu/$(. /etc/os-release && echo "$VERSION_CODENAME")/prod $(. /etc/os-release && echo "$VERSION_CODENAME") main" > /etc/apt/sources.list.d/mssql-tools18.list
  apt-get update -y
  ACCEPT_EULA=Y apt-get install -y mssql-tools18
  ln -sf /opt/mssql-tools18/bin/sqlcmd /usr/local/bin/sqlcmd
fi

log "writing Caddyfile for $DOMAIN"
sed -e "s/\${MORABBI_DOMAIN}/$DOMAIN/g" -e "s/\${CADDY_EMAIL}/$EMAIL/g" \
  "$SCRIPT_DIR/../caddy/Caddyfile" > /etc/caddy/Caddyfile

if [ ! -f "$INSTALL_DIR/morabbi.env" ]; then
  log "creating $INSTALL_DIR/morabbi.env (fill in real values!)"
  cat > "$INSTALL_DIR/morabbi.env" <<'EOF'
ConnectionStrings__DefaultConnection=Server=127.0.0.1;Database=Morabbi;User Id=morabbi;Password=CHANGE_ME;TrustServerCertificate=True;MultipleActiveResultSets=true
LocalAuth__Secret=CHANGE_ME_MIN_32_CHARS
NehzatHub__Key=
MORABBI_SQL_HOST=127.0.0.1
MORABBI_SQL_USER=morabbi
MORABBI_SQL_PASS=CHANGE_ME
EOF
  chown morabbi: "$INSTALL_DIR/morabbi.env"
  chmod 600 "$INSTALL_DIR/morabbi.env"
fi

log "installing systemd unit"
cp "$SCRIPT_DIR/../systemd/morabbi-api.service" /etc/systemd/system/morabbi-api.service
systemctl daemon-reload
systemctl enable morabbi-api caddy

caddy validate --config /etc/caddy/Caddyfile
systemctl restart caddy

chown -R morabbi: "$INSTALL_DIR"
log "setup complete. Copy api.tar.gz / web.tar.gz to $INSTALL_DIR and run scripts/update.sh"
log "remember: ufw allow 80,443 (if using ufw)"
