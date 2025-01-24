FROM node:20-alpine

WORKDIR /app

COPY ./package.json .

RUN npm install -g nodemon
COPY . .
RUN npm run build
CMD ["npm", "run", "start"]