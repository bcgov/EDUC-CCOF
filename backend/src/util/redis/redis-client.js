const { createClient, createCluster } = require('redis');
const config = require('../../config');
const log = require('../../components/logger');

class Redis {
  static client;

  static async shutdown(signal = 'quit') {
    log.info(`Received ${signal}, closing Redis connection`);
    try {
      await Redis.client.quit();
    } catch (err) {
      log.error('Redis had to force quit', err);
      await Redis.client.disconnect();
    }
  }

  static get isReady() {
    if (Redis.client) {
      return Redis.clustered ? Redis.client.isOpen : Redis.client.isReady;
    }
    return false;
  }

  static get clustered() {
    return config.get('redis:clustered') == 'true';
  }

  static get rootNode() {
    return `redis://${config.get('redis:host')}:${config.get('redis:port')}`;
  }

  static encodeKey(string) {
    return Buffer.from(string).toString('hex');
  }

  static decodeKey(hex) {
    return Buffer.from(hex, 'hex').toString('utf8');
  }

  static async init() {
    if (!Redis.client) {
      if (Redis.clustered) {
        log.info('using CLUSTERED Redis implementation');
        Redis.client = createCluster({
          rootNodes: [
            {
              url: Redis.rootNode,
            },
          ],
        });
      } else {
        log.info('using STANDALONE Redis implementation');
        Redis.client = createClient({ url: Redis.rootNode });
      }

      Redis.client.on('error', (error) => {
        log.error(`Error occurred in Redis client. ${error}`);
      });

      Redis.client.on('end', () => {
        log.info('Redis client closed.');
      });

      Redis.client.on('ready', () => {
        log.info('Redis Ready.');
      });

      Redis.client.on('connect', () => {
        log.info('Connected to Redis.');
      });

      process.on('SIGTERM', () => Redis.shutdown('SIGTERM'));
      process.on('SIGINT', () => Redis.shutdown('SIGINT'));

      await Redis.client.connect();
    } else {
      log.warning('Redis.init() called after it was already initialized');
    }
  }
}
module.exports = Redis;
