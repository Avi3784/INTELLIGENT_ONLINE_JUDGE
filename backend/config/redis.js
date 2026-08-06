const Redis = require('ioredis');

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
let redisClient = null;

function getRedisClient() {
	if (!redisClient) {
		redisClient = new Redis(redisUrl, {
			lazyConnect: true,
			maxRetriesPerRequest: 1,
			retryStrategy: () => null,
		});

		redisClient.on('error', (err) => console.error('Redis error:', err.message));
		redisClient.on('connect', () => console.log('Connected to Redis'));
	}

	return redisClient;
}

module.exports = {
	get: (...args) => getRedisClient().get(...args),
	set: (...args) => getRedisClient().set(...args),
	del: (...args) => getRedisClient().del(...args),
	quit: (...args) => (redisClient ? redisClient.quit(...args) : Promise.resolve()),
	disconnect: (...args) => (redisClient ? redisClient.disconnect(...args) : undefined),
};
