mysql-password = Eidoh5zo
mysql-root-password = root
postgresql-password = Eidoh5zo

# Enable https site in apache2 (needs valid private and public keys inside ./development/self-signed-ssl/ directory)
.PHONY: https-enable
https-enable:
	sudo a2ensite osmhu-ssl
	sudo systemctl reload apache2

# Init databases for development environment
.PHONY: init-empty-db
init-empty-db:
	make mysql-clean-db && \
	make mysql-create-db && \
	make mysql-init-empty

.PHONY: init-existing-db
init-existing-db:
	make mysql-clean-db && \
	make mysql-create-db && \
	make mysql-import-existing

.PHONY: init-from-scratch
init-from-scratch:
	make postgres-clean-db && \
	make postgres-create-db && \
	make import-osm-data-to-postgres && \
	make mysql-clean-db && \
	make mysql-create-db && \
	make mysql-init-empty && \
	make convert-postgres-to-mysql

# Different database creation parts
.PHONY: postgres-clean-db
postgres-clean-db:
	sudo -u postgres dropdb --if-exists gis
	sudo -u postgres dropuser --if-exists osmhu

.PHONY: postgres-create-db
postgres-create-db:
	sudo -u postgres createdb gis && \
	sudo -u postgres psql -d gis -c "CREATE USER osmhu PASSWORD '$(postgresql-password)';" && \
	sudo -u postgres psql -d gis -c "GRANT ALL PRIVILEGES ON DATABASE gis TO osmhu;" && \
	sudo -u postgres psql -d gis -c "GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO osmhu;" && \
	sudo -u postgres psql -d gis -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO osmhu;" && \
	sudo -u postgres psql -d gis -c "CREATE EXTENSION postgis; CREATE EXTENSION hstore;"

.PHONY: import-osm-data-to-postgres
import-osm-data-to-postgres:
	if ! [ -f "development/hungary-latest.osm.pbf" ]; then \
		curl -o "development/hungary-latest.osm.pbf" "https://download.geofabrik.de/europe/hungary-latest.osm.pbf"; \
	fi && \
	chmod +r development/hungary-latest.osm.pbf && \
	sudo -u postgres osm2pgsql -s --create --database gis development/hungary-latest.osm.pbf

.PHONY: mysql-clean-db
mysql-clean-db:
	mysql -u root -p$(mysql-root-password) -e "DROP USER IF EXISTS osmhu;"
	mysql -u root -p$(mysql-root-password) -e "DROP DATABASE IF EXISTS osm_hu;"

.PHONY: mysql-create-db
mysql-create-db:
	mysql -u root -p$(mysql-root-password) -e "CREATE DATABASE osm_hu CHARACTER SET utf8 COLLATE utf8_hungarian_ci;" && \
	mysql -u root -p$(mysql-root-password) -e "GRANT ALL ON osm_hu.* TO 'osmhu'@'%' IDENTIFIED BY '$(mysql-password)';"

.PHONY: mysql-init-empty
mysql-init-empty:
	mysql -u osmhu -p$(mysql-password) osm_hu < scripts/db.txt

.PHONY: mysql-import-existing
mysql-import-existing:
	mysql -u osmhu -p$(mysql-password) osm_hu < development/mysql/export.sql

.PHONY: convert-postgres-to-mysql
convert-postgres-to-mysql:
	APPLICATION_ENV="development" php scripts/copydb.php

.PHONY: mysql-export
mysql-export:
	mysqldump -u osmhu -p$(mysql-password) osm_hu > development/mysql/export_`date +%Y-%m-%d_%H%M%S`.sql
