ARG REDIS_VERSION="7.0.8"

FROM redis:${REDIS_VERSION}

RUN apt-get update && apt-get install -y tini && rm -rf /var/lib/apt/lists/*

ENTRYPOINT ["/usr/bin/tini", "--"]
