FROM artifacts.developer.gov.bc.ca/docker-remote/node:16.20.1-alpine3.18

RUN mkdir -p /logs \
    && chmod 755 /logs

WORKDIR /opt/app-root/src
RUN ln -s /logs .

COPY package*.json ./
RUN npm ci

COPY . /opt/app-root/src

# Installs latest Chromium package.
RUN apk upgrade --no-cache --available \
    && apk add --no-cache dbus chromium chromium-chromedriver

ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/ \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser \
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    GHOSTSCRIPT_PATH=/usr/bin/gs

EXPOSE 443 8080
CMD ["npm", "start"]
