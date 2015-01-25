/**
 *	Resource to handle REST requests for Status
 *	@author Joris Verbogt <joris@notificareapp.com>
 *	@copyright Notificare
 *	@version 0.1
 */

// Imports
var express = require('express');
/**
 * Constructor
 * @returns {Status}
 */
var Status = module.exports = function() {
};

Status.prototype = {
	/**
	 * Attach routes to main Express app
	 * @param app {Express} The main app
	 * @returns {Function} Routing handler
	 */
	attach: function(app) {
		this.app = app;
		return express.Router()
			.get('/', this.handleIndex.bind(this));
	},
	/**
	 * Middleware
	 * 
	 * See if we have a DB connection, otherwise return a 404
	 * @param request {http.IncomingMessage}
	 * @param response {http.ServerResponse} 
	 * @param next {Function} next middleware callback
	 */
	handleIndex: function(request, response, next) {
		response.status(200).send({
			status: 'ok'
		});
	}
};