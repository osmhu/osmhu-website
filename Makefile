mysql-password = Eidoh5zo
mysql-root-password = root
postgresql-password = Eidoh5zo

.PHONY: build
build:
	make create-distribution && \
	npm install && \
	npm run build-css && \
	npm run build


.PHONY: create-distribution
create-distribution:
	rm -rf distribution
	mkdir -p distribution

#	Copy all directories
	mkdir -p distribution/config distribution/includes distribution/js distribution/kepek distribution/query
	cp -R config distribution
	cp -R includes distribution
	rsync -a kepek distribution --exclude *.xcf
	cp -R query distribution

	mkdir -p distribution/css
	cp -R node_modules/leaflet/dist/images distribution/css

#	Copy root files
	cp .htaccess distribution
	cp favicon.ico distribution
	cp lib.php distribution
	cp terkep.php distribution
	cp validatestreetnames.php distribution

#	Copy content html files
	cp *.shtml distribution

#	Add read permission for other users (eg. www-data)
	chmod --recursive o+r distribution
#	+X sets execute/search only if the file is a directory (or already has execute permission for some user)
	chmod --recursive +X distribution


.PHONY: develop
develop:
	mkdir -p .tmp && \
	make create-distribution && \
	npm run install-if-changed && \
	npm run build-css && \
	npm run build-development


.PHONY: watch
watch:
	make develop && \
	fswatch --one-per-batch --recursive --monitor poll_monitor --event Created --event Updated \
		config css includes js kepek query .htaccess lib.php terkep.php validatestreetnames.php \
		Makefile package.json *.shtml | xargs -n1 -I{} make develop


# Inside vagrant virtualbox machine, need to do npm install in a directory that is not synced
# https://github.com/laravel/homestead/issues/1239#issuecomment-523320952
.PHONY: npm-install-in-tmp
npm-install-in-tmp:
	mkdir -p /tmp/npm_install/ && \
	cp package.json /tmp/npm_install && \
	cp package-lock.json /tmp/npm_install && \
	cd /tmp/npm_install && \
	npm i --silent && \
	cp -r /tmp/npm_install/node_modules ${CURDIR} && \
	rm -rf /tmp/npm_install/ && \
	cd ${CURDIR} && \
	npm i --silent


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


.PHONY: download-latest-osm-data
download-latest-osm-data:
	rm -f "development/hungary-latest.osm.pbf" && \
	curl -o "development/hungary-latest.osm.pbf" "https://download.geofabrik.de/europe/hungary-latest.osm.pbf"


.PHONY: import-osm-data-to-postgres
import-osm-data-to-postgres:
	if ! [ -f "development/hungary-latest.osm.pbf" ]; then \
		echo "Latest OSM data is missing. Run 'make download-latest-osm-data' or download manually to development/hungary-latest.osm.pbf"; \
		exit 1; \
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
	mysql -u root -p$(mysql-root-password) -e "CREATE USER IF NOT EXISTS osmhu IDENTIFIED BY '$(mysql-password)';" && \
	mysql -u root -p$(mysql-root-password) -e "GRANT ALL ON osm_hu.* TO 'osmhu'@'%';"


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
