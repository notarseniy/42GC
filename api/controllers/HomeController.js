/**
 * HomeController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */
var rand = require('generate-key');
var crypto = require('crypto');
var path = require('path');
var url = require('url');


function getStats(cb) {
	async.waterfall([
		function getCount(callback) {
			link.query('select count(1) from link',
				function (err, result) {
					if (err) return callback(err);

					callback(null, result[0]['count(1)']);
				});
		},
		function getVisitors(count, callback) {
			link.query('SELECT SUM(visitors) FROM link',
				function(err, result) {
					if (err) return callback(err);

					callback(null, {links: count, visitors: result[0]['SUM(visitors)']});
				});
		}
	],
	function (err, result) {
		if (err) return cb(err);

		if (result.visitors === null) result.visitors = 0;

		cb(null, result);
	});
}

module.exports = {

	index: function(req,res){
		getStats(function(err, result) {
			if (err) throw err;

			res.view({stats: result});
		});
	},

	shorten: function shorten(req,res){
		//Original URL
		shorten.url = req.body.url;
		shorten.parsedUrl = url.parse(shorten.url);
		
		// Short URL
		if (!req.body.name)
			shorten.sUrl = rand.generateKey(4);
		else
			shorten.sUrl = req.body.name.replace(/[^a-zA-Z0-9-_]/g, '');
		
		async.waterfall([
			function checkUrl(callback) {
				if (!shorten.url)
					return callback({msg: 'Введите URL!'});
				
				if (shorten.parsedUrl.protocol === null) {
					shorten.url = 'http://' + shorten.url;
					shorten.parsedUrl = url.parse(shorten.url);
				}
				
				if (shorten.parsedUrl.hostname === '42gc.ru' || shorten.parsedUrl.hostname === '4gc.me')
					return callback({msg: 'Сокращать ссылки 42GC нет смысла'});
				
				link.findOne({
					shortURL: shorten.sUrl
				}).done(function(err, link) {
					if (err) return callback(err);

					if (link) {
						callback({msg: 'Увы, но этот короткий адрес уже занят'});
					} else {
						callback(null);
					}
				});
			},
			function createLink(callback) {
				shorten.delink = crypto.createHash('sha1').update(shorten.sUrl + rand.generateKey(8)).digest('hex');
				
				link.create({
					originalURL: shorten.url,
					shortURL: shorten.sUrl,
					visitors: '0',
					delink: shorten.delink
				}).done(function(err, link) {
					if (err) {
							if (err.ValidationError.originalURL) {
								return callback({msg: 'Введите правильный URL!'});
							} else {
								return callback(err);
							}
						}

					callback(null, {originalURL: shorten.url, shortURL: shorten.sUrl, delink: shorten.delink});
				});
			}],
			function(err, result) {
					if (err) {
						if (err.msg) {
							return res.view('home/index', {message: err.msg});
						} else {
							console.log(err);
							throw err;
						}
					}

					res.view('home/shorten',result);
			}
		);
	},

	shorted: function(req,res) {
		if (req.url == '/') return res.redirect('/');
		
		link.findOne({
			shortURL: req.param('shortURL')
		}).done(function(err, link) {
			if (!_.isObject(link)) return res.redirect('/');

			if (err) {
				return res.redirect('/');
			} else {
				link.visitors++;
				link.save(function(err) {
					if (err) console.error('[ERROR] Can\'t save visitor at', Date(),' with err:\n',err)
				});
				res.redirect(link.originalURL);
			}
		});
	},

	info: function(req,res) {
		if (req.url == '/') return res.redirect('/');
		
		link.findOne({
			shortURL: req.param('shortURL')
		}).done(function(err, link) {
			if (!_.isObject(link)) return res.redirect('/');

			if (err) {
				return res.redirect('/');
			} else {
				res.view({originalURL: link.originalURL, shortURL: link.shortURL, createdAt: link.createdAt, visitors: link.visitors});
			}
		});
	},

	delinkTpl: function delinkTpl(req,res) {
		link.findOne({
				delink: req.param('delink')
		}).done(function(err, link) {
				if (err) throw err;
				if (!_.isObject(link)) return res.redirect('/');
				
				res.view('home/delink',{shortURL: link.shortURL, delink: link.delink});
		});
	},

	delink: function delink(req,res) {
		if (req.param('confirm') === 'yeas') {
			link.find({delink: req.param('delink')}).done(function (err, shorten) {
				shorten[0].destroy(function(err) {
					if (err) throw err;
					res.json({code: 200});
				});
			});
		} else {
			res.redirect('/');
		}
	},

	favicon: function(req,res) {
		res.sendfile('assets/favicon.ico');
	},

	robots: function(req,res) {
		res.sendfile('assets/robots.txt');
	},

	about: function(req,res) {
		res.view('home/about');
	}
};
