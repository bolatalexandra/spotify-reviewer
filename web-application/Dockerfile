FROM node:lts-alpine

LABEL title="web-application" \
  description="Web application"

RUN mkdir -p /usr/src/app
COPY . /usr/src/app
RUN rm /usr/src/app/Dockerfile

WORKDIR /usr/src/app
RUN npm install

RUN npm install -g sass

WORKDIR /usr/src/app/src/public
RUN sass --style=compressed scss/core/style.scss:css/style.bundle.css

WORKDIR /usr/src/app

ENTRYPOINT [ "npm", "start" ]