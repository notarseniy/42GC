module.exports = {
	
	// Init custom express middleware
	express: {
		customMiddleware: function (app) {
			app.use(require('etagify')());
		}
		
	}
	
};
