FROM node:18.16

EXPOSE 3000

WORKDIR /app

COPY ./package.json ./

RUN npm install

RUN npm install -g nodemon

COPY . .

CMD ["npm", "run", "start"]