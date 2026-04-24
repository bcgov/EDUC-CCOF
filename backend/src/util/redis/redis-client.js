const { createClient, createCluster } = require('redis');
const config = require('../../config');
const log = require('../../components/logger');

class Redis {
  static client;
  static isRepairing = false;
  static prefix = config.get('redis:prefix');

  static async shutdown(signal = 'close') {
    log.info(`Received ${signal}, closing Redis connection`);
    try {
      await Redis.client.close();
    } catch (err) {
      log.error('Redis had to force quit', err);
      await Redis.client.destroy();
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
    if (Redis.isReady) {
      return Redis.client.get(`${Redis.prefix}${key}`, ...args);
    }
  }

  /**
   * A prefix wrapper for `Redis.client.set`. Do not use this for cached data
   * that is shared between pod environments.
   *
   * @param {string} key - The un-prefixed Redis key
   * @param {args} args - The rest of the command args
   */
  static async set(key, ...args) {
    if (Redis.isReady) {
      return Redis.client.set(`${Redis.prefix}${key}`, ...args);
    }
  }

  /**
   * A prefix wrapper for `Redis.client.json.get`. Do not use this for cached data
   * that is shared between pod environments.
   *
   * @param {string} key - The un-prefixed Redis key
   * @param {args} args - The rest of the command args
   */
  static async jsonGet(key, ...args) {
    if (Redis.isReady) {
      return Redis.client.json.get(`${Redis.prefix}${key}`, ...args);
    }
  }

  /**
   * A prefix wrapper for `Redis.client.json.set`. Do not use this for cached data
   * that is shared between pod environments.
   *
   * @param {string} key - The un-prefixed Redis key
   * @param {args} args - The rest of the command args
   */
  static async jsonSet(key, ...args) {
    if (Redis.isReady) {
      return Redis.client.json.set(`${Redis.prefix}${key}`, ...args);
    }
  }

  /**
   * A prefix wrapper for `Redis.client.expire`. Do not use this for cached data
   * that is shared between pod environments.
   *
   * @param {string} key - The un-prefixed Redis key
   * @param {args} args - The rest of the command args
   */
  static async expire(key, ...args) {
    if (Redis.isReady) {
      return Redis.client.expire(`${Redis.prefix}${key}`, ...args);
    }
  }

  static async create() {
    if (Redis.clustered) {
      log.info('using CLUSTERED Redis implementation');
      Redis.client = createCluster({
        rootNodes: [
          {
            url: `redis://redis-0.${config.get('redis:host')}:${config.get('redis:port')}`,
          },
          {
            url: `redis://redis-1.${config.get('redis:host')}:${config.get('redis:port')}`,
          },
          {
            url: `redis://redis-2.${config.get('redis:host')}:${config.get('redis:port')}`,
          },
        ],
      });
    } else {
      log.info('using STANDALONE Redis implementation');
      Redis.client = createClient({ url: `redis://${config.get('redis:host')}:${config.get('redis:port')}` });
    }
  }

  static async areNodesDown() {
    const nodeString = await Redis.client.CLUSTER_NODES();
    return nodeString.includes('fail');
  }

  static async repairConnection(maxRetries = 5) {
    Redis.isRepairing = true;
    let retries = 0;
    let repaired = false;
    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    while(retries <= maxRetries) {
      const downedNodes = await Redis.areNodesDown();
      if (!downedNodes) {
        try {
          await Redis.shutdown();
          await Redis.create();
          repaired = true;
          Redis.isRepairing = false;
          log.info('Redis nodes should be reconnected.');
          break;
        } catch (e) {
          log.error(`There was a problem repairing the redis connection. Retries left: ${maxRetries - retries}`);
        }
      }
      retries += 1;
      await delay(retries * 2000);
    }

    if (!repaired) {
      log.error('Unable to repair Redis connection.');
      Redis.isRepairing = false;
    }
  }

  static async init() {
    if (!Redis.client) {
      await Redis.create();
      Redis.client.on('error', (error) => {
        log.error(`Error occurred in Redis client. ${error}`);
      });

      Redis.client.on('node-error', async (error) => {
        log.error('A Redis cluster node has encountered an error: ', error);
        if (error.message.includes('EHOSTUNREACH') && !Redis.isRepairing) {
          Redis.repairConnection();
        }
      });

      Redis.client.on('end', () => {
        log.info('Redis client closed.');
      });

      Redis.client.on('ready', () => {
        log.info('Redis Ready.');
      });

      Redis.client.on('node-ready', (node) => {
        log.info('A Redis cluster node is ready', node);
      });

      Redis.client.on('connect', () => {
        log.info('Connected to Redis.');
      });

      Redis.client.on('node-connect', (node) => {
        log.info('A Redis cluster node has connected.', node);
      });

      Redis.client.on('reconnecting', () => {
        log.warn('Redis attempting to reconnect...');
      });

      Redis.client.on('node-reconnecting', (node) => {
        log.info('A Redis cluster node is attempting to re-connect to a node.', node);
      });

      Redis.client.on('disconnect', () => {
        log.info('The Redis cluster has disconnected.');
      });

      Redis.client.on('node-disconnect', (node) => {
        log.info('A Redis cluster node has disconnected.', node);
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
