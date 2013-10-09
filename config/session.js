/**
 * Session
 * 
 * Sails session integration leans heavily on the great work already done by Express, but also unifies 
 * Socket.io with the Connect session store. It uses Connect's cookie parser to normalize configuration
 * differences between Express and Socket.io and hooks into Sails' middleware interpreter to allow you
 * to access and auto-save to `req.session` with Socket.io the same way you would with Express.
 *
 * For more information on configuring the session, check out:
 * http://sailsjs.org/#documentation
 */
const local = require('./local.js');

module.exports.session = { 
	secret: local.secret,


	adapter: 'redis',
	host: local.redis.host,
	port: local.redis.port,
	ttl: local.redis.ttl,
	db: local.redis.db,
	pass: local.redis.pass,
	prefix: local.redis.prefix

};
