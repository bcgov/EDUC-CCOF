FROM artifacts.developer.gov.bc.ca/docker-remote/node:16.20.0-alpine3.18

ENV NPM_CONFIG_CACHE /tmp/npm
RUN mkdir -p /logs \
    && chmod 755 /logs

WORKDIR /opt/app-root/src
RUN ln -s /logs .

COPY package*.json ./
RUN npm ci

COPY . /opt/app-root/src

RUN apk upgrade --no-cache --available \
    && apk add --no-cache chromium-swiftshader nss freetype \
      harfbuzz ca-certificates ttf-freefont tini ghostscript

ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/ \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

RUN mkdir -p /tmp/npm \
    && chmod -R 777 /tmp/npm

EXPOSE 443 8080
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "--max-old-space-size=450", "./src/server.js"]
