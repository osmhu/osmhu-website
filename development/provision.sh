#!/usr/bin/env bash

# Install all tools required for development on Ubuntu 20.04 (run as root user)

SOURCE_CODE_DIR="/srv/osmhu-website"

# unattended install
# source: https://serverfault.com/questions/500764/dpkg-reconfigure-unable-to-re-open-stdin-no-file-or-directory
export DEBIAN_FRONTEND=noninteractive


echo "Updating packages..."
if ! apt-get -qq update > /dev/null; then
	echo "ERROR! Failed to update packages. Exiting" >&2
	exit 1
fi


echo "Installing MySQL..."
debconf-set-selections <<< "mysql-server mysql-server/root_password password root"
debconf-set-selections <<< "mysql-server mysql-server/root_password_again password root"
if ! apt-get install -qq mysql-server mysql-client > /dev/null; then
	echo "ERROR! Failed to install MySQL. Exiting" >&2
	exit 1
fi


echo "Installing PostgreSQL..."
if ! apt-get install -qq postgresql-12 postgis postgresql-12-postgis-scripts > /dev/null; then
	echo "ERROR! Failed to install PostgreSQL. Exiting" >&2
	exit 1
fi


echo "Installing database importer tool (osm2pgsql)..."
if ! apt-get install -qq osm2pgsql > /dev/null; then
	echo "ERROR! Failed to install osm2pgsql. Exiting" >&2
	exit 1
fi


echo "Installing apache2 and PHP..."
if ! apt-get install -qq apache2 php7.4 libapache2-mod-php php7.4-mysql php7.4-pgsql > /dev/null; then
	echo "ERROR! Failed to install apache2 and PHP. Exiting" >&2
	exit 1
fi


echo "Enabling required apache2 modules..."
if ! command -v a2enmod &> /dev/null; then
	echo "ERROR! a2enmod command could not be found. Exiting" >&2
	exit 1
fi
a2enmod -q include # server side includes
a2enmod -q rewrite # support rewrite rules
a2enmod -q ssl # HTTPS


echo "Creating symlinks for apache2 site configs..."
HTTP_SITE_CONFIG="${SOURCE_CODE_DIR}/development/apache2/osmhu-http.conf"
if [ ! -r ${HTTP_SITE_CONFIG} ]; then
	echo "ERROR! Apache2 site config not found at ${HTTP_SITE_CONFIG}" >&2
	if [ "${SOURCE_CODE_DIR}" == "/srv/osmhu-website" ]; then
		echo "Vagrant machines should have the repository synced at /srv/osmhu-website, check it." >&2
	fi
	echo "Exiting" >&2
	exit 1
fi
ln -s "${HTTP_SITE_CONFIG}" /etc/apache2/sites-available/osmhu-http.conf
ln -s "${SOURCE_CODE_DIR}/development/apache2/osmhu-ssl.conf" /etc/apache2/sites-available/osmhu-ssl.conf


echo "Disabling default apache2 site config..."
if ! command -v a2dissite &> /dev/null; then
	echo "ERROR! a2dissite command could not be found. Exiting" >&2
	exit 1
fi
a2dissite -q 000-default.conf


echo "Enabling osmhu http apache2 site config..."
if ! command -v a2ensite &> /dev/null; then
	echo "ERROR! a2ensite command could not be found. Exiting" >&2
	exit 1
fi
a2ensite -q osmhu-http


echo "Installing phpMyAdmin for graphical db editing..."
echo "phpMyAdmin accessible at http://osmhu.lan/phpmyadmin/"
if ! apt-get install -qq debconf-utils > /dev/null; then
	echo "ERROR! Failed to install debconf-utils. Exiting" >&2
	exit 1
fi
echo "phpmyadmin phpmyadmin/dbconfig-install boolean true" | debconf-set-selections
echo "phpmyadmin phpmyadmin/mysql/app-pass password root" | debconf-set-selections
echo "phpmyadmin phpmyadmin/reconfigure-webserver multiselect apache2" | debconf-set-selections
if ! apt-get install -qq phpmyadmin > /dev/null; then
	echo "ERROR! Failed to install phpmyadmin. Exiting" >&2
	exit 1
fi


echo "Enabling apache2 autostart..."
systemctl enable --quiet apache2


echo "Restarting apache2 to apply changes..."
systemctl reload apache2
systemctl restart apache2


echo "Installing curl for network installs..."
if ! apt-get install -qq curl > /dev/null; then
	echo "ERROR! Failed to install curl. Exiting" >&2
	exit 1
fi


echo "Installing Node.js..."
if ! apt-get install -qq build-essential ca-certificates gnupg > /dev/null; then
	echo "ERROR! Failed to install build-essential. Exiting" >&2
	exit 1
fi
# Source: https://github.com/nodesource/distributions/wiki/Repository-Manual-Installation
NODE_MAJOR=20
mkdir -p /etc/apt/keyrings
rm -f /etc/apt/keyrings/nodesource.gpg
curl -fsSL https://deb.nodesource.com/gpgkey/nodesource-repo.gpg.key \
	| gpg --dearmor -o /etc/apt/keyrings/nodesource.gpg
echo "deb [signed-by=/etc/apt/keyrings/nodesource.gpg] https://deb.nodesource.com/node_${NODE_MAJOR}.x nodistro main" \
	| tee /etc/apt/sources.list.d/nodesource.list > /dev/null
if ! apt-get update > /dev/null; then
	echo "ERROR! Failed to update apt package list after adding Node.js sources. Exiting" >&2
	exit 1
fi
if ! apt-get install -qq nodejs > /dev/null; then
	echo "ERROR! Failed to install Node.js. Exiting" >&2
	exit 1
fi


echo "Installing composer for managing PHP dependencies..."
# Source: https://getcomposer.org/doc/faqs/how-to-install-composer-programmatically.md
COMPOSER_VERSION_GIT="87cd816aea1282eded203f49e3196a8505fdec9f" # 2.3.4
COMPOSER_INSTALLER="https://raw.githubusercontent.com/composer/getcomposer.org/${COMPOSER_VERSION_GIT}/web/installer"
if ! wget ${COMPOSER_INSTALLER} -O - -q | php -- --quiet; then
	echo "ERROR! Failed to install composer. Exiting" >&2
	exit 1
fi
if ! mv composer.phar /usr/local/bin/composer; then
	echo "ERROR! Failed to move installed composer to global directory. Exiting" >&2
	exit 1
fi


echo "Updating npm version..."
if ! command -v npm &> /dev/null; then
	echo "ERROR! npm command could not be found. Exiting" >&2
	exit 1
fi
npm install --silent --global npm@latest


echo "Installing git for version control..."
if ! apt-get install -qq git > /dev/null; then
	echo "ERROR! Failed to install git. Exiting" >&2
	exit 1
fi


echo "Linking chromedriver alias for /snap/bin/chromium.chromedriver"
if ! snap alias chromium.chromedriver chromedriver > /dev/null; then
	echo "ERROR! Failed to alias chromium.chromedriver as chromedriver, required for running e2e tests. Exiting" >&2
	exit 1
fi


echo "Installing htop..."
if ! apt-get install -qq htop > /dev/null; then
	echo "ERROR! Failed to install htop. Exiting" >&2
	exit 1
fi
