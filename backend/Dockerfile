FROM artifacts.developer.gov.bc.ca/docker-remote/node:22.17.1-alpine3.22

RUN mkdir -p /logs \
    && chmod 755 /logs

WORKDIR /opt/app-root/src
RUN ln -s /logs .

COPY package*.json ./
RUN npm ci

COPY . /opt/app-root/src

EXPOSE 443 8080
CMD ["node", "--max-old-space-size=450", "./src/server.js"]
