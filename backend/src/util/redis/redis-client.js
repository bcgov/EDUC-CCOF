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

  static init() {
    if (config.get('redis:clustered') == 'true') {
      log.info('using CLUSTERED Redis implementation');
      Redis.client = createCluster([
        {
          host: config.get('redis:host'),
          port: config.get('redis:port'),
        },
      ]);
    } else {
      log.info('using STANDALONE Redis implementation');
      Redis.client = new createClient({
        host: config.get('redis:host'),
        port: config.get('redis:port'),
      });
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

    Redis.client.connect();

    process.on('SIGTERM', () => Redis.shutdown('SIGTERM'));
    process.on('SIGINT', () => Redis.shutdown('SIGINT'));
  }
}
module.exports = Redis;
