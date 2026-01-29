FROM redis:8.4.0-alpine

RUN apk add --no-cache tini

ENTRYPOINT ["/sbin/tini", "--"]
