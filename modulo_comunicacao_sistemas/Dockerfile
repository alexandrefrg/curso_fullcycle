FROM php:7.4-cli

WORKDIR /var/www

# installing necessary libs to composer and sqlite3
RUN apt-get update && \
    apt-get install libzip-dev -y && \
    docker-php-ext-install zip &&\
    apt-get install sqlite3 -y

# installing composer
RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && \
    php composer-setup.php && \
    php -r "unlink('composer-setup.php');"

# initializing laminas project
RUN php composer.phar create-project laminas-api-tools/api-tools-skeleton --ignore-platform-req=ext-intl

# initializing local db
RUN touch /var/www/api-tools-skeleton/test.sqlite
RUN sqlite3 test.sqlite 'create table users (id int, name varchar(255), email varchar(255));'

# running cmd to starting serving api
CMD [ "php", "-S", "0.0.0.0:8080", "-t", "/var/www/api-tools-skeleton/public", "/var/www/api-tools-skeleton/public/index.php"]
