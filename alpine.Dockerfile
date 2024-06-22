FROM node:18.18.0-alpine as node
WORKDIR /app
COPY . .
# Install Angular CLI globally
RUN yarn global add @angular/cli

# Install dependencies using Yarn
RUN yarn install

# Build the Angular app
RUN ng build

FROM nginx:stable-alpine3.17
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=node /app/dist/engine-stand-web /usr/share/nginx/html