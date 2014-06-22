var passport = require('passport');

passport.serializeUser(function (user, done) {
	done(null, user);
});

passport.deserializeUser(function (user, done) {
	if (user.id) {
		done(null, user);
	} else {
		User.findOne(user, function (err, user) {
			if (err) return done(err);

			done(null, user);
		});
	}
});

module.exports = {

	// Init custom express middleware
	express: {
		customMiddleware: function (app) {
			app.use(passport.initialize());
			app.use(passport.session());
		}

	}
};
