FROM artifacts.developer.gov.bc.ca/docker-remote/node:16.20.0-alpine3.18

ENV NPM_CONFIG_CACHE /tmp/npm
RUN mkdir -p /logs \
    && chmod 755 /logs

WORKDIR /opt/app-root/src
RUN ln -s /logs .

COPY package*.json ./
RUN npm ci

COPY . /opt/app-root/src

# Installs latest Chromium package.
#RUN apk upgrade --no-cache --available \
#    && apk add --no-cache dbus chromium chromium-chromedriver ghostscript

RUN apk upgrade --no-cache --available \
    && apk add --no-cache chromium nss freetype harfbuzz ca-certificates ttf-freefont font-noto-emoji ghostscript \
    && apk add --no-cache \
    --repository=https://dl-cdn.alpinelinux.org/alpine/edge/testing \
    font-wqy-zenhei

COPY chrome.conf /etc/fonts/local.conf

# Add Chrome as a user
RUN mkdir -p /usr/src/app \
    && chown -R 1013920000 /usr/src/app


ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/ \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    GHOSTSCRIPT_PATH=/usr/bin/gs

ENV CHROMIUM_FLAGS="--disable-software-rasterizer --disable-dev-shm-usage"

EXPOSE 443 8080
CMD ["npm", "start"]
