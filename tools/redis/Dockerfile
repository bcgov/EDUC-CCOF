FROM redis:8.4.0-alpine

RUN apt-get update && apt-get install -y tini && rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["/usr/bin/tini", "--"]
