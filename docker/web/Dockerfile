FROM php:8.2-apache

# Update the package lists and install the Postgresql dependencies
RUN apt-get update && apt-get install -y \
    libpq-dev \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*

# Support server side includes
RUN a2enmod -q include

# Support rewrite rules
RUN a2enmod -q rewrite

# Support HTTPS
RUN a2enmod -q ssl

# Install MySQL and Postgresql PHP extensions
RUN docker-php-ext-install \
    pdo_mysql \
    pdo_pgsql
