FROM node:20-alpine

WORKDIR /app

COPY ./package.json .

RUN npm install -g nodemon
COPY . .
RUN npm run build

EXPOSE 5053
CMD ["npm", "run", "start", "--host", "0.0.0.0"]