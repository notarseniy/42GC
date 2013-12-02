/**
 * Routes
 *
 * Sails uses a number of different strategies to route requests.
 * Here they are top-to-bottom, in order of precedence.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.routes = {
   '/robots.txt': 'home.robots',
   '/favicon.ico': 'home.favicon',

   '/': 'home.index',
   '/about': 'home.about',
   'post /shorten': 'home.shorten',
   '/:shortURL': 'home.shorted',
   '/i/:shortURL': 'home.info',
   '/info/:shortURL': 'home.info',
   'get /d/:delink': 'home.delinkTpl',
   'post /d/:delink': 'home.delink'/*,
   '/ru': 'lang.ru',
   '/en': 'lang.en'*/
};
