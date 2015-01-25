/**
 *	Resource to handle REST requests for Live API
 *	@author Joris Verbogt <joris@notificareapp.com>
 *	@copyright Notificare
 *	@version 0.1
 */

// Live
var express = require('express'),
    LiveApi = require('notificare').LiveApi;

/**
 * Constructor
 * @returns {Import}
 */
var Live = module.exports = function() {
};

Live.prototype = {
	/**
	 * Attach routes to main Express app
	 * @param app {Express} The main app
	 * @returns {Function} Routing handler
	 */
	attach: function(app) {
		this.app = app;
        this.logger = app.get('logger') || console;

        var liveApiConfig = app.get('liveApiConfig');
        this.httpGateway = new LiveApi(liveApiConfig.privateKey, liveApiConfig.publicKey).httpGateway;

        return express.Router()
            .post('/', this.handlePayload.bind(this))
            .get('/', this.handleVerify.bind(this));
	},
    /**
     * Middleware
     *
     * Handle incoming payload
     * @param request {http.IncomingMessage}
     * @param response {http.ServerResponse}
     * @param next {Function} next middleware callback
     */
    handlePayload: function(request, response, next) {
        if (!request.header('x-notificare-public-key') || !request.header('x-notificare-signature')) {
            response.status(400).send({message: 'missing parameters'});
        } else {
            try {
                if (!this.httpGateway.validate(request.header('x-notificare-public-key'), request.body, request.header('x-notificare-signature'))) {
                    response.status(400).send({error: 'invalid signature'});
                } else {
                    this.app.get('messageQueue').write(request.body);
                    response.status(200).send({message: 'message received'});
                }
            } catch (err) {
                response.status(400).send({error: err.message});
            }
        }
    },
    /**
     * Middleware
     *
     * Verify
     * @param request
     * @param response
     * @param next
     */
    handleVerify: function(request, response, next) {
        if (!request.header('x-notificare-public-key') || !request.query.challenge) {
            response.status(400).send({message: 'missing parameters'});
        } else {
            try {
                response.status(200).send(this.httpGateway.verify(request.header('x-notificare-public-key'), request.query.challenge));
            } catch (err) {
                response.status(400).send({error: err.message});
            }
        }
    }
};