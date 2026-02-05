const { createClient, createCluster } = require('redis');
const config = require('../../config');
const log = require('../../components/logger');

class Redis {
  static client;
  static prefix = config.get('redis:prefix');

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

  /**
   * A prefix wrapper for `Redis.client.get`. Do not use this for cached data
   * that is shared between pod environments.
   *
   * @param {string} key - The un-prefixed Redis key
   * @param {args} args - The rest of the command args
   */
  static async get(key, ...args) {
    return Redis.client.get(`${Redis.prefix}${key}`, ...args);
  }

  /**
   * A prefix wrapper for `Redis.client.set`. Do not use this for cached data
   * that is shared between pod environments.
   *
   * @param {string} key - The un-prefixed Redis key
   * @param {args} args - The rest of the command args
   */
  static async set(key, ...args) {
    return Redis.client.set(`${Redis.prefix}${key}`, ...args);
  }

  /**
   * A prefix wrapper for `Redis.client.json.get`. Do not use this for cached data
   * that is shared between pod environments.
   *
   * @param {string} key - The un-prefixed Redis key
   * @param {args} args - The rest of the command args
   */
  static async jsonGet(key, ...args) {
    return Redis.client.json.get(`${Redis.prefix}${key}`, ...args);
  }

  /**
   * A prefix wrapper for `Redis.client.json.set`. Do not use this for cached data
   * that is shared between pod environments.
   *
   * @param {string} key - The un-prefixed Redis key
   * @param {args} args - The rest of the command args
   */
  static async jsonSet(key, ...args) {
    return Redis.client.json.set(`${Redis.prefix}${key}`, ...args);
  }

  /**
   * A prefix wrapper for `Redis.client.expire`. Do not use this for cached data
   * that is shared between pod environments.
   *
   * @param {string} key - The un-prefixed Redis key
   * @param {args} args - The rest of the command args
   */
  static async expire(key, ...args) {
    return Redis.client.expire(`${Redis.prefix}${key}`, ...args);
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
