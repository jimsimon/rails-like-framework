FROM node:latest

ENV NODE_ENV=production

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install -g yarn
RUN yarn install --production

EXPOSE 3000

CMD yarn start
