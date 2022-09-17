FROM node:16-alpine

ENV NODE_ENV=production \
    NPM_CONFIG_PREFIX=/home/node/.npm-global \
    PATH=$PATH:/home/node/.npm-global/bin:/home/node/node_modules/.bin:$PATH

RUN mkdir -p /usr/src/app/node_modules

RUN chown -R node:node /usr/src/app

USER node

WORKDIR /usr/src/app

COPY --chown=node:node ./safebox-api/package.json /usr/src/app

RUN npm i -g @nestjs/cli concurrently

RUN npm i

RUN npm cache clean --force

COPY --chown=node:node ./safebox-api/ /usr/src/app

EXPOSE 3000

CMD [ "npm", "run", "start:docker" ]