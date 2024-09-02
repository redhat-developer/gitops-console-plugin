FROM docker.io/library/node:22 AS build

ADD . /usr/src/app
WORKDIR /usr/src/app
RUN yarn config set network-timeout 600000 -g
RUN yarn install && yarn build

FROM --platform=linux/amd64 registry.redhat.io/rhel8/httpd-24

USER root
RUN chown -R 1001:0 /opt/app-root/src
USER 1001
RUN chmod g+rwx /opt/app-root/src

COPY --from=build /usr/src/app/ssl.conf /etc/httpd/conf.d
COPY --from=build /usr/src/app/dist /var/www/html/plugin

CMD run-httpd
