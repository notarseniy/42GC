/**
 * HomeController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */
var rand = require("generate-key");

module.exports = {

	index: function(req,res){
		res.view();
	},

	shorten: function(req,res){
		var shortenURL = rand.generateKey(7);
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
		link.findOne({
			shortURL: req.param('shortURL')
		}).done(function(err, link) {
			if (err) {
			return res.redirect('/');
			} else {
			res.redirect(link.originalURL);
			}
		});
	}
};
