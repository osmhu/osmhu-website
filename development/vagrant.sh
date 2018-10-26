#!/usr/bin/env bash

# Script to initialize virtual machine for development

# update package repository
apt-get update

# install MySQL
debconf-set-selections <<< 'mysql-server mysql-server/root_password password root'
debconf-set-selections <<< 'mysql-server mysql-server/root_password_again password root'
apt-get install -y mysql-server mysql-client

# install PostgreSQL
apt-get install -y postgresql-9.5 postgis postgresql-9.5-postgis-scripts

# install database importer
apt-get install -y osm2pgsql

# install web server
apt-get install -y apache2 php7.0 libapache2-mod-php php7.0-mysql php7.0-pgsql
a2enmod include # server side includes
a2enmod rewrite # support rewrite rules

# copy apache site config
cp /vagrant/development/apache2/osmhu.conf /etc/apache2/sites-available/osmhu.conf
sed -i -e '/\/home\/feri\/wwwroot\/osmhu/ s/\/home\/feri\/wwwroot\/osmhu/\/var\/www/' /etc/apache2/sites-available/osmhu.conf
sed -i -e '/osmhu.lan/ s/osmhu.lan/localhost/' /etc/apache2/sites-available/osmhu.conf
a2ensite osmhu

# install PhpMyAdmin for graphical db editing
apt-get install -y debconf-utils
echo "phpmyadmin phpmyadmin/dbconfig-install boolean true" | debconf-set-selections
echo "phpmyadmin phpmyadmin/mysql/app-pass password root" | debconf-set-selections
echo "phpmyadmin phpmyadmin/reconfigure-webserver multiselect apache2" | debconf-set-selections
apt-get install -y phpmyadmin

# restart apache after enabling features
service apache2 restart

# install node.js for frontend development
# source: https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
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