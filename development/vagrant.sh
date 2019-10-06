#!/usr/bin/env bash

# Script to initialize virtual machine for development

# unattended install
# source: https://serverfault.com/questions/500764/dpkg-reconfigure-unable-to-re-open-stdin-no-file-or-directory
export DEBIAN_FRONTEND=noninteractive

# update package repository
apt-get -qq update

# install MySQL
debconf-set-selections <<< 'mysql-server mysql-server/root_password password root'
debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password root'
apt-get install -qq mysql-server mysql-client

# install PostgreSQL
apt-get install -qq postgresql-10 postgis postgresql-10-postgis-scripts

# install database importer
apt-get install -qq osm2pgsql

# install web server
apt-get install -qq apache2 php7.2 libapache2-mod-php php7.2-mysql php7.2-pgsql
a2enmod -q include # server side includes
a2enmod -q rewrite # support rewrite rules
a2enmod -q ssl # HTTPS

# copy apache site config
cp /vagrant/development/apache2/osmhu-http.conf /etc/apache2/sites-available/osmhu-http.conf
cp /vagrant/development/apache2/osmhu-ssl.conf /etc/apache2/sites-available/osmhu-ssl.conf

# remove default apache2 config
a2dissite -q 000-default.conf

a2ensite -q osmhu-http

# Enable development with HTTPS (needs keys, refer to README)
#a2ensite osmhu-ssl

# install PhpMyAdmin for graphical db editing
apt-get install -qq debconf-utils
echo "phpmyadmin phpmyadmin/dbconfig-install boolean true" | debconf-set-selections
echo "phpmyadmin phpmyadmin/mysql/app-pass password root" | debconf-set-selections
echo "phpmyadmin phpmyadmin/reconfigure-webserver multiselect apache2" | debconf-set-selections
apt-get install -qq phpmyadmin

# autostart apache2
systemctl enable apache2

# restart apache to apply changes
systemctl reload apache2
systemctl restart apache2

# install node.js for frontend development
# source: https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
apt-get install -qq nodejs build-essential

# update npm
npm update -g npm

# sync project dir with /var/www
if ! [ -L /var/www ]; then
  rm -rf /var/www
  ln -fs /vagrant /var/www
fi

# default directory when connecting from ssh
if ! [ -e /home/vagrant/.bash_profile ]; then
  echo "cd /var/www" >> /home/vagrant/.bash_profile
fi

# install npm packages needed by frontend
cd /var/www
npm i --quiet # supress output, show stderr and warnings

# tab completion for npm
# source: https://docs.npmjs.com/cli/completion
npm completion >> ~/.bashrc

# utility
apt-get install -qq htop
