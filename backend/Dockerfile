FROM artifacts.developer.gov.bc.ca/docker-remote/node:20.18.0-alpine3.19

ENV NPM_CONFIG_CACHE /tmp/npm
RUN mkdir -p /logs \
    && chmod 755 /logs

WORKDIR /opt/app-root/src
RUN ln -s /logs .

COPY package*.json ./
RUN npm ci

COPY . /opt/app-root/src

RUN mkdir -p /tmp/npm \
    && chmod -R 777 /tmp/npm

EXPOSE 443 8080
CMD ["node", "--max-old-space-size=450", "./src/server.js"]
