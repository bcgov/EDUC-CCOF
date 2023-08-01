FROM artifacts.developer.gov.bc.ca/docker-remote/node:lts-alpine3.13

RUN mkdir -p /logs
RUN chmod 755 /logs

WORKDIR /opt/app-root/src
RUN ln -s /logs .

COPY package*.json ./
RUN npm ci

COPY . /opt/app-root/src

# Installs latest Chromium package.
RUN apk upgrade --no-cache --available \
    && apk add --no-cache chromium
RUN apk add --no-cache dbus chromium chromium-chromedriver
RUN dbus-daemon --system

# Add Chrome as a user
RUN mkdir -p /usr/src/app \
    && adduser -D chrome \
    && chown -R chrome:chrome /usr/src/app
# Run Chrome as non-privileged

ENV CHROME_BIN=/usr/bin/chromium-browser \
    CHROME_PATH=/usr/lib/chromium/

ENV CHROMIUM_FLAGS="--disable-software-rasterizer --disable-dev-shm-usage --no-sandbox --disable-gpu"

EXPOSE 443 8080
CMD ["npm", "start"]
