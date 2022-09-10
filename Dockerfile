FROM node:16-alpine as builder

ARG GAMERARENA_STAGE
ENV GAMERARENA_STAGE=${GAMERARENA_STAGE}

WORKDIR /gamerarena-frontend-builder

COPY package.json package.json
COPY yarn.lock yarn.lock

RUN yarn install

# copy relevant env file
COPY .env.${GAMERARENA_STAGE} .env.${GAMERARENA_STAGE}

COPY @types @types
COPY components components
COPY constants constants
COPY contexts contexts
COPY data data
COPY fonts fonts
COPY helpers helpers
COPY hooks hooks
COPY lang lang
COPY pages pages
COPY public public
COPY scripts scripts
COPY .babelrc .babelrc
COPY next.config.js next.config.js
COPY next-env.d.ts next-env.d.ts
COPY postcss.config.js postcss.config.js
COPY react-datepicker.css react-datepicker.css
COPY sentry.client.config.js sentry.client.config.js
COPY sentry.properties sentry.properties
COPY sentry.server.config.js sentry.server.config.js
COPY style.css style.css
COPY tsconfig.json tsconfig.json

RUN yarn generateRobotsTxt
RUN yarn generateSitemap
RUN yarn build
RUN yarn export

FROM nginx:alpine

COPY --from=builder /gamerarena-frontend-builder/out /usr/share/nginx/html
COPY etc/conf.nginx /etc/nginx/conf.d/default.conf

EXPOSE 80
