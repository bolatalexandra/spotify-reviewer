FROM node:lts-alpine

LABEL title="user-comments" \
  title="User comments"

RUN mkdir -p /usr/src/app
COPY . /usr/src/app
RUN rm /usr/src/app/Dockerfile

WORKDIR /usr/src/app
RUN npm install

ENTRYPOINT ["npm", "start"]