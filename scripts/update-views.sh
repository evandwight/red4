psql -U $DB_USER -d $DB_DATABASE -f ./prisma/views/drop-views.sql
psql -U $DB_USER -d $DB_DATABASE -f ./prisma/views/create-views.sql
npx prisma generate --schema ./prisma/views/schema.prisma