# FROM alpine
FROM node:16.16.0
# RUN apk add --update nodejs npm
WORKDIR /app

ENV APPLICATION_NAME=ENGINE_STAND
ENV APPLICATION_PORT=3005
ENV NODE_ENV=prod

RUN npm install -g yarn
RUN npm install -g @angular/cli
COPY package*.json ./
RUN yarn
COPY . .
RUN ng build --optimization
RUN npm install pm2 -g

ARG PORT=3005
ENV PORT=$PORT
EXPOSE $PORT
ENTRYPOINT ["ng","serve","--host","0.0.0.0"]
