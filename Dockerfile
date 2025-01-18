FROM node:20

WORKDIR /usr/src/user-manager-api 

COPY ./package.json .
RUN npm install --only=prod