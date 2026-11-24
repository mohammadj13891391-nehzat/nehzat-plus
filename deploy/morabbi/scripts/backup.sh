#!/usr/bin/env bash
# Daily SQL Server backup with 30-day retention.
# Cron: 0 3 * * * /opt/morabbi/scripts/backup.sh >> /var/log/morabbi-backup.log 2>&1
set -euo pipefail

INSTALL_DIR=/opt/morabbi
BACKUP_DIR="$INSTALL_DIR/backups"
set -a
source "$INSTALL_DIR/morabbi.env"
set +a

DB="${MORABBI_BACKUP_DB:-Morabbi}"
NAME="morabbi_${DB}_$(date +%Y%m%d_%H%M%S).bak"

sqlcmd -S "${MORABBI_SQL_HOST:-127.0.0.1}" -U "$MORABBI_SQL_USER" -P "$MORABBI_SQL_PASS" -C -b \
  -Q "BACKUP DATABASE [$DB] TO DISK='$BACKUP_DIR/$NAME' WITH COMPRESSION, INIT"

find "$BACKUP_DIR" -name 'morabbi_*.bak' -mtime +30 -delete
echo "[backup] $(date -Is) $NAME"
