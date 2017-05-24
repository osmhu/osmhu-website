mysql-password = Eidoh5zo
mysql-root-password = root
postgresql-password = Eidoh5zo

.PHONY: clean-postgres-db
clean-postgres-db:
	sudo -u postgres dropdb --if-exists gis
	sudo -u postgres dropuser --if-exists osmhu

.PHONY: clean-mysql-db
clean-mysql-db:
	mysql -u root -p$(mysql-root-password) -e "DROP USER IF EXISTS osmhu;"
	mysql -u root -p$(mysql-root-password) -e "DROP DATABASE IF EXISTS osm_hu;"

.PHONY: create-postgres-db
create-postgres-db:
	sudo -u postgres createdb gis && \
	sudo -u postgres psql -d gis -c "CREATE USER osmhu PASSWORD '$(postgresql-password)';" && \
	sudo -u postgres psql -d gis -c "GRANT ALL PRIVILEGES ON DATABASE gis TO osmhu;" && \
	sudo -u postgres psql -d gis -c "CREATE EXTENSION postgis; CREATE EXTENSION hstore;"

.PHONY: import-osm-data-to-postgres
import-osm-data-to-postgres:
	chmod +r development/hungary-latest.osm.pbf && \
	sudo -u postgres osm2pgsql -s --create --database gis development/hungary-latest.osm.pbf

.PHONY: create-mysql-db
create-mysql-db:
	mysql -u root -p$(mysql-root-password) -e "CREATE DATABASE osm_hu CHARACTER SET utf8 COLLATE utf8_hungarian_ci;" && \
	mysql -u root -p$(mysql-root-password) -e "GRANT ALL ON osm_hu.* TO 'osmhu'@'%' IDENTIFIED BY '$(mysql-password)';" && \
	mysql -u osmhu -p$(mysql-password) osm_hu < scripts/db.txt

.PHONY: convert-postgres-to-mysql
convert-postgres-to-mysql:
	APPLICATION_ENV="development" php scripts/copydb.php

.PHONY: export-mysql
export-mysql:
	mysqldump -u osmhu -p$(mysql-password) osm_hu > development/mysql/export_`date +%Y-%m-%d_%H%M%S`.sql

.PHONY: all
all:
	make clean-postgres-db && \
	make create-postgres-db && \
	make import-osm-data-to-postgres && \
	make clean-mysql-db && \
	make create-mysql-db && \
	make convert-postgres-to-mysql
