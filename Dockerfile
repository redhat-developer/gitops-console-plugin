FROM docker.io/library/node:16 AS build

ADD . /usr/src/app
WORKDIR /usr/src/app
RUN yarn config set network-timeout 600000 -g
RUN yarn install && yarn build

FROM --platform=linux/amd64 docker.io/library/nginx:stable

RUN chmod g+rwx /var/cache/nginx /var/run /var/log/nginx
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
