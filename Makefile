mysql-password = Eidoh5zo
mysql-root-password = root
postgresql-password = Eidoh5zo

.PHONY: install-dependencies
install-dependencies:
	npm install && \
	composer install


.PHONY: build
build:
	make create-distribution && \
	npm install && \
	npm run build-css && \
	npm run build


.PHONY: create-distribution
create-distribution:
	rm --recursive --force distribution
	mkdir --parents distribution

#	Copy all directories
	mkdir --parents distribution/config distribution/includes distribution/js distribution/kepek distribution/query
	cp --recursive config distribution
	cp --recursive includes distribution
	rsync --archive kepek distribution --exclude *.xcf
	cp --recursive query distribution

	mkdir --parents distribution/css
	cp --recursive node_modules/leaflet/dist/images distribution/css

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
	mkdir --parents .tmp && \
	make create-distribution && \
	npm run install-if-changed && \
	npm run build-css && \
	npm run build-development


.PHONY: watch
watch:
	make develop && \
	fswatch --one-per-batch --recursive --monitor poll_monitor --event Created --event Updated \
		config css includes js kepek query .htaccess lib.php terkep.php validatestreetnames.php \
		Makefile package.json *.shtml | xargs --max-args 1 -I{} make develop


.PHONY: lint
lint:
	npm run lint:editorconfig && \
	npm run lint:css && \
	npm run lint:js && \
	make lint-php


.PHONY: lint-php
lint-php:
	vendor/bin/ecs check --config development/php-coding-standard.php


.PHONY: test-e2e
test-e2e:
	npm run test-e2e


# Inside vagrant virtualbox machine, need to do npm install in a directory that is not synced
# https://github.com/laravel/homestead/issues/1239#issuecomment-523320952
.PHONY: npm-install-in-tmp
npm-install-in-tmp:
	mkdir --parents /tmp/npm_install/ && \
	cp package.json /tmp/npm_install && \
	cp package-lock.json /tmp/npm_install && \
	cd /tmp/npm_install && \
	npm i --silent && \
	cp --recursive /tmp/npm_install/node_modules ${CURDIR} && \
	rm --recursive --force /tmp/npm_install/ && \
	cd ${CURDIR} && \
	npm i --silent


# Enable https site in apache2 (needs valid private and public keys inside ./development/self-signed-ssl/ directory)
.PHONY: https-enable
https-enable:
	sudo a2ensite osmhu-ssl
	sudo systemctl reload apache2


.PHONY: init-empty-db
init-empty-db:
	make mysql-drop-db && \
	make mysql-create-db && \
	make mysql-init-empty


.PHONY: init-existing-db
init-existing-db:
	make mysql-drop-db && \
	make mysql-create-db && \
	make mysql-import-existing


.PHONY: init-from-scratch
init-from-scratch:
	make postgres-drop-db && \
	make postgres-create-db && \
	make import-osm-data-to-postgres && \
	make mysql-drop-db && \
	make mysql-create-db && \
	make mysql-init-empty && \
	make convert-postgres-to-mysql


.PHONY: postgres-drop-db
postgres-drop-db:
	sudo --user postgres dropdb --if-exists gis
	sudo --user postgres dropuser --if-exists osmhu


# Need to create user with cli command, using variable password in sql script is not easy
.PHONY: postgres-create-db
postgres-create-db:
	sudo --user postgres createdb gis && \
	sudo --user postgres psql --dbname gis --command "CREATE USER osmhu PASSWORD '$(postgresql-password)'" && \
	sudo --user postgres psql --dbname gis --file db/postgres/postgres-gis-setup.sql


.PHONY: download-latest-osm-data
download-latest-osm-data:
	rm --force "development/hungary-latest.osm.pbf" && \
	curl --output "development/hungary-latest.osm.pbf" "https://download.geofabrik.de/europe/hungary-latest.osm.pbf"


.PHONY: import-osm-data-to-postgres
import-osm-data-to-postgres:
	if ! [ -f "development/hungary-latest.osm.pbf" ]; then \
		echo "Latest OSM data missing (searched at development/hungary-latest.osm.pbf)"; \
		echo "Run 'make download-latest-osm-data' or download manually."; \
		exit 1; \
	fi && \
	chmod +r development/hungary-latest.osm.pbf && \
	sudo --user postgres osm2pgsql --slim --create --database gis development/hungary-latest.osm.pbf


.PHONY: mysql-drop-db
mysql-drop-db:
	MYSQL_PWD="$(mysql-root-password)" mysql --user root < db/mysql/mysql-drop-db.sql


# Need to create user with cli command, using variable password in sql script is not easy
.PHONY: mysql-create-db
mysql-create-db:
	MYSQL_PWD="$(mysql-root-password)" mysql --user root \
		--execute "CREATE USER IF NOT EXISTS osmhu IDENTIFIED BY '$(mysql-password)';" && \
	MYSQL_PWD="$(mysql-root-password)" mysql --user root < db/mysql/mysql-create-db.sql


.PHONY: mysql-init-empty
mysql-init-empty:
	MYSQL_PWD="$(mysql-password)" mysql --user osmhu osm_hu < db/mysql/mysql-create-tables.sql


.PHONY: mysql-import-existing
mysql-import-existing:
	MYSQL_PWD="$(mysql-password)" mysql --user osmhu osm_hu < db/mysql/mysql-dump.sql


.PHONY: convert-postgres-to-mysql
convert-postgres-to-mysql:
	APPLICATION_ENV="development" php scripts/copydb.php


.PHONY: mysql-dump
mysql-dump:
	MYSQL_PWD="$(mysql-password)" mysqldump --user osmhu --skip-extended-insert \
		--no-tablespaces osm_hu > db/mysql/mysql-dump_`date +%Y-%m-%d_%H%M%S`.sql


.PHONY: generate-city-rewrite-rules
generate-city-rewrite-rules:
	mkdir --parents .tmp && \
	APPLICATION_ENV="development" php scripts/city-rewrite-rules.php > .tmp/city-rewrite-rules.txt && \
	echo "City rewrite rules saved to .tmp/city-rewrite-rules.txt"
