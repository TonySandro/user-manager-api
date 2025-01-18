FROM node:20

WORKDIR /usr/src/account-manager-api 

COPY ./package.json .
RUN npm install --only=prod