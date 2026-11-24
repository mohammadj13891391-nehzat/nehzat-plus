#!/usr/bin/env bash
# Health-gated update. Expects /opt/morabbi/api.tar.gz and/or /opt/morabbi/web.tar.gz.
# API: stop -> swap dir -> start -> wait for /api/health -> rollback on failure.
set -euo pipefail

INSTALL_DIR=/opt/morabbi
cd "$INSTALL_DIR"

log() { echo "[update] $*"; }

if [ -f api.tar.gz ]; then
  log "updating API"
  rm -rf api.new && mkdir -p api.new
  tar -xzf api.tar.gz -C api.new
  systemctl stop morabbi-api 2>/dev/null || true
  rm -rf api.old
  if [ -d api ]; then mv api api.old; fi
  mv api.new api
  chown -R morabbi: api
  systemctl start morabbi-api

  ok=0
  for _ in $(seq 1 30); do
    if curl -fsS -m 3 http://127.0.0.1:3010/api/health >/dev/null 2>&1; then ok=1; break; fi
    sleep 1
  done
  if [ "$ok" != 1 ]; then
    log "new build unhealthy - rolling back"
    systemctl stop morabbi-api 2>/dev/null || true
    rm -rf api
    if [ -d api.old ]; then mv api.old api; fi
    systemctl start morabbi-api
    journalctl -u morabbi-api -n 50 --no-pager || true
    exit 1
  fi
  rm -rf api.old
  log "API healthy on :3010"
fi

if [ -f web.tar.gz ]; then
  log "updating web (SPA)"
  rm -rf web.new && mkdir -p web.new
  tar -xzf web.tar.gz -C web.new
  rm -rf web.old
  if [ -d web ]; then mv web web.old; fi
  mv web.new web
  chown -R morabbi: web
  rm -rf web.old
  log "web updated"
fi

log "done"
