#!/bin/bash
# Define variables
BACKUP_DIR="./backups"
TIMESTAMP=$(date +"%F")
DB_CONTAINER="epicbook-db"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

# Execute mysqldump inside the running container
docker exec $DB_CONTAINER /usr/bin/mysqldump -u root -p'${DB_ROOT_PASSWORD}' bookstore > $BACKUP_DIR/bookstore_backup_$TIMESTAMP.sql

# Keep only the last 7 days of backups locally
find $BACKUP_DIR -type f -mtime +7 -name "*.sql" -delete

echo "Backup completed for $TIMESTAMP"