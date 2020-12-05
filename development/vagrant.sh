#!/usr/bin/env bash

# Script to initialize virtual machine for development

# unattended install
# source: https://serverfault.com/questions/500764/dpkg-reconfigure-unable-to-re-open-stdin-no-file-or-directory
export DEBIAN_FRONTEND=noninteractive

echo "Update packages..."
apt-get -qq update > /dev/null

echo "Install MySQL..."
debconf-set-selections <<< 'mysql-server mysql-server/root_password password root'
debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password root'
apt-get install -qq mysql-server mysql-client > /dev/null

echo "Install PostgreSQL..."
apt-get install -qq postgresql-12 postgis postgresql-12-postgis-scripts > /dev/null

echo "Install database importer tool (osm2pgsql)..."
apt-get install -qq osm2pgsql > /dev/null

echo "Install apache2 and PHP..."
apt-get install -qq apache2 php7.4 libapache2-mod-php php7.4-mysql php7.4-pgsql > /dev/null
a2enmod -q include # server side includes
a2enmod -q rewrite # support rewrite rules
a2enmod -q ssl # HTTPS

echo "Copy apache site configs..."
cp /vagrant/development/apache2/osmhu-http.conf /etc/apache2/sites-available/osmhu-http.conf
cp /vagrant/development/apache2/osmhu-ssl.conf /etc/apache2/sites-available/osmhu-ssl.conf

echo "Remove default apache2 config..."
a2dissite -q 000-default.conf

echo "Enabling http site config..."
a2ensite -q osmhu-http

# enable development with HTTPS (needs keys, refer to README)
#a2ensite osmhu-ssl

echo "Install PhpMyAdmin for graphical db editing..."
apt-get install -qq debconf-utils > /dev/null
echo "phpmyadmin phpmyadmin/dbconfig-install boolean true" | debconf-set-selections
echo "phpmyadmin phpmyadmin/mysql/app-pass password root" | debconf-set-selections
echo "phpmyadmin phpmyadmin/reconfigure-webserver multiselect apache2" | debconf-set-selections
apt-get install -qq phpmyadmin > /dev/null

echo "Enable apache2 autostart..."
systemctl enable --quiet apache2

echo "Restart apache2 to apply changes..."
systemctl reload apache2
systemctl restart apache2

echo "Install build-essential required by nodejs native code..."
apt-get install -qq build-essential > /dev/null

echo "Install node.js for frontend development..."
# https://github.com/nodesource/distributions/blob/master/README.md#manual-installation
curl -sSL https://deb.nodesource.com/gpgkey/nodesource.gpg.key | APT_KEY_DONT_WARN_ON_DANGEROUS_USAGE=DontWarn apt-key --quiet add -
VERSION=node_14.x
DISTRO="$(lsb_release -s -c)"
echo "deb https://deb.nodesource.com/$VERSION $DISTRO main" | tee /etc/apt/sources.list.d/nodesource.list > /dev/null
echo "deb-src https://deb.nodesource.com/$VERSION $DISTRO main" | tee -a /etc/apt/sources.list.d/nodesource.list > /dev/null
apt-get update > /dev/null
apt-get install -qq nodejs > /dev/null

echo "Update npm..."
npm install --silent --global npm

echo "Create /var/www as a link to synced /vagrant dir..."
if ! [ -L /var/www ]; then
  rm -rf /var/www
  ln -fs /vagrant /var/www
fi

echo "Set default directory when connecting from ssh..."
if ! [ -e /home/vagrant/.bash_profile ]; then
  echo "cd /var/www" >> /home/vagrant/.bash_profile
fi

if [ ! -d /var/www/node_modules ]; then
  echo "Install npm packages needed by frontend..."
  # on virtualbox, need to do npm install in not synced directory, because npm install has problems in synced dirs
  # https://github.com/laravel/homestead/issues/1239#issuecomment-523320952
  mkdir -p /tmp/npm_install/
  cp /var/www/package.json /tmp/npm_install
  cd /tmp/npm_install
  npm i --quiet # supress output, show stderr and warnings
  cp -r /tmp/npm_install/node_modules /var/www
  rm -rf /tmp/npm_install/
  cd /var/www/node_modules
  npm i # verify, audit and generate package-lock.json in project directory
else
  echo "Skipping npm install, because node_modules found in project directory"
fi

echo "Install tab completion for npm..."
# source: https://docs.npmjs.com/cli/completion
npm completion >> ~/.bashrc

echo "Install htop..."
apt-get install -qq htop > /dev/null
