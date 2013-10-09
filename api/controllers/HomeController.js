/**
 * HomeController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */
var rand = require("generate-key");

module.exports = {

	index: function(req,res){
		res.etagify();
		res.view();
	},

	shorten: function(req,res){
		res.etagify();
		var shortenURL = rand.generateKey(3);
		link.create({
			originalURL: req.body.url,
			shortURL: shortenURL
		}).done(function(err, link) {
			if (err) {
				res.redirect('/');
			}
			else {
			res.view({originalURL: req.body.url,shortedURL: shortenURL});
			}
		});
	},

	shorted: function(req,res){
		if (req.url == '/') return res.view('home/index');
		res.etagify();
		link.findOne({
			shortURL: req.param('shortURL')
		}).done(function(err, link) {
			if (!_.isObject(link)) return res.redirect('/');
			if (err) {
			return res.redirect('/');
			} else {
			res.redirect(link.originalURL);
			}
		});
	}
};
