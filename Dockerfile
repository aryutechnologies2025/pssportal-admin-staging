FROM httpd:2.4

RUN sed -i 's/#LoadModule rewrite_module/LoadModule rewrite_module/' /usr/local/apache2/conf/httpd.conf
COPY . /usr/local/apache2/htdocs/

RUN echo '<Directory "/usr/local/apache2/htdocs">\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>' >> /usr/local/apache2/conf/httpd.conf

EXPOSE 80
CMD ["httpd-foreground"]

