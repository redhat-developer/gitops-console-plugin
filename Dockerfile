FROM node:14

USER root

WORKDIR /usr/src/plugin
COPY . /usr/src/plugin
RUN yarn install
RUN yarn build

RUN chmod g+wr -R /usr/src/plugin/dist

USER node

EXPOSE 9001
ENTRYPOINT [ "./http-server.sh", "./dist" ]
