FROM artifacts.developer.gov.bc.ca/docker-remote/node:lts-alpine3.13

RUN mkdir -p /logs
RUN chmod 755 /logs

WORKDIR /opt/app-root/src
RUN ln -s /logs .

COPY package*.json ./
RUN npm ci

COPY . /opt/app-root/src
EXPOSE 443 8080
CMD ["npm", "start"]
