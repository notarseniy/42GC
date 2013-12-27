/**
 * HomeController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */
var rand = require('generate-key');
var crypto = require('crypto');
var path = require('path');

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
		res.etagify();
		getStats(function(err, result) {
			if (err) throw err;

			res.view({stats: result});
		});
	 },

	 shorten: function shorten(req,res){
		res.etagify();

		shorten.url = req.body.url;//Original URL

		if (!req.body.name) {// Short URL
			shorten.sUrl = rand.generateKey(4);
		} else {
			shorten.sUrl = req.body.name.replace(/[^a-zA-Z0-9-_]/g, '');
		}

		async.waterfall([
			function isExists(callback) {
				if (!shorten.url) {
					return callback({msg: 'Введите URL!', show: true});
				}
				link.findOne({
					shortURL: shorten.sUrl
				}).done(function(err, link) {
					if (err) return callback(err);

					if (link) {
						callback({msg: 'Увы, но этот короткий адрес уже занят', show: true});
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
						if (err) return callback(err);

						callback(null, {originalURL: shorten.url, shortURL: shorten.sUrl, delink: shorten.delink});
					});
			 }],
			 function(err, result) {
					if (err) {
						 if (err.show) {
							return res.view('home/index', {message: err.msg});
						 } else {
							throw err;
							return;
						 }
					}

					res.view('home/shorten',result);
			 }
		);
	 },

	 shorted: function(req,res) {
		if (req.url == '/') return res.redirect('/');

		res.etagify();

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

		res.etagify();

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
	 res.etagify();
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
	 link.destroy(function(err) {
			if (err) {
				 throw err;
			}
	 });
	 res.json({code: 204});
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
			res.etagify();
			res.view('home/about');
	 }
};
