FROM node:16-alpine
LABEL NAME="ms-office-adapter"
LABEL MAINTAINER Philipp Hoegner "philipp.hoegner@cloudecosystem.org"
LABEL SUMMARY="This image is used to start the MS Office Adapter for OIH"

RUN apk add --no-cache libc6-compat

WORKDIR /usr/src/app

COPY package.json /usr/src/app

RUN npm install --production

COPY . /usr/src/app

RUN chown -R node:node .

USER node

ENTRYPOINT ["npm", "start"]
