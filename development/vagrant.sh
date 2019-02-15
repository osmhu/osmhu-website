#!/usr/bin/env bash

# Script to initialize virtual machine for development

# update package repository
apt-get update

# install MySQL
debconf-set-selections <<< 'mysql-server mysql-server/root_password password root'
debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password root'
apt-get install -y mysql-server mysql-client

# install PostgreSQL
apt-get install -y postgresql-10 postgis postgresql-10-postgis-scripts

# install database importer
apt-get install -y osm2pgsql

# install web server
apt-get install -y apache2 php7.2 libapache2-mod-php php7.2-mysql php7.2-pgsql
a2enmod include # server side includes
a2enmod rewrite # support rewrite rules
a2enmod ssl # HTTPS

# copy apache site config
cp /vagrant/development/apache2/osmhu-http.conf /etc/apache2/sites-available/osmhu-http.conf
cp /vagrant/development/apache2/osmhu-ssl.conf /etc/apache2/sites-available/osmhu-ssl.conf

# remove default apache2 config
a2dissite 000-default.conf

a2ensite osmhu-http

# Enable development with HTTPS (needs keys, refer to README)
#a2ensite osmhu-ssl

# install PhpMyAdmin for graphical db editing
apt-get install -y debconf-utils
echo "phpmyadmin phpmyadmin/dbconfig-install boolean true" | debconf-set-selections
echo "phpmyadmin phpmyadmin/mysql/app-pass password root" | debconf-set-selections
echo "phpmyadmin phpmyadmin/reconfigure-webserver multiselect apache2" | debconf-set-selections
apt-get install -y phpmyadmin

# autostart apache2
systemctl enable apache2

# restart apache to apply changes
systemctl reload apache2
systemctl restart apache2

# install node.js for frontend development
# source: https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
apt-get install -y nodejs build-essential

# sync project dir with /var/www
if ! [ -L /var/www ]; then
  rm -rf /var/www
  ln -fs /vagrant /var/www
fi

# install npm packages needed for frontend bundle generation
npm install browserify watchify -g

# install npm packages needed by frontend
cd /var/www
npm i

# default directory when connection from ssh
if ! [ -e /home/vagrant/.bash_profile ]; then
  echo "cd /var/www" >> /home/vagrant/.bash_profile
fi

# utility
apt-get install htop
