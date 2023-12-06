FROM node:18.16

EXPOSE 4200

WORKDIR /app

COPY ./package.json ./

RUN npm install --force

COPY . .

CMD ["npm", "run", "start"]