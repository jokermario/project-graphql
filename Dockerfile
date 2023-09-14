FROM node:19.6.0-alpine3.17

WORKDIR /user/src/app

COPY . .

RUN npm ci
RUN npm install pm2 -g
RUN npm run build

RUN chown -R node:node /user/src/app/
USER node

CMD ["npm", "run", "start:prod"]