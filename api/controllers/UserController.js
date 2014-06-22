/**
 * UserController
 *
 * @module :: Controller
 * @description :: Users.
 */
var cfg = require('../../config/local.js');

var passport = require('passport'),
	OAuth2Strategy = require('passport-oauth2').Strategy;

passport.use(new OAuth2Strategy({
				authorizationURL: cfg.oauth2.authorizationURL,
				tokenURL: cfg.oauth2.tokenURL,
				clientID: cfg.oauth2.clientID,
				clientSecret: cfg.oauth2.clientSecret,
				callbackURL: cfg.oauth2.callbackURL
			}, function(accessToken, refreshToken, profile, done) {
					User.findOrCreate({username: accessToken.username}, function (err, user) {
						if (!user.username) {
							user.username = accessToken.username;
							user.owns = [];

							user.save(function (err, user) {
								return done(err, user);
							});
						} else {
							return done(err, user);
						}
					});
				}
			));

module.exports = {

	login: function (req, res) {
		res.redirect(cfg.oauth2.loginURI);
	},

	callback: function (req, res) {
		passport.authenticate('oauth2', function (err, user, info) {
			if (!user) {
				return res.json({
					error: info
				});
			}
			req.logIn(user, function (err) {
				if (err) {
					throw err;
				}
				res.redirect('/');
				return;
			});
		})(req, res);
	},

	profile: function (req, res) {
		link.find({owner: req.user.id}, function (err, links) {
			if (err) throw err;

			res.view('user/profile', {links: links});
		});
	},

	logout: function (req, res) {
		req.logout();
		res.redirect('/');
	}

};
