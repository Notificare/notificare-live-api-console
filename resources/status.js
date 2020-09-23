/**
 *	Resource to handle REST requests for Status
 *	@author Joris Verbogt <joris@notificareapp.com>
 *	@copyright Notificare
 *	@version 0.1
 */

// Imports
const express = require("express");
/**
 * Constructor
 * @returns {Status}
 */
module.exports = class Status {
  /**
   * Attach routes to main Express app
   * @param app {Express} The main app
   * @returns {Function} Routing handler
   */
  attach(app) {
    this.app = app;
    return express.Router().get("/", this.handleIndex.bind(this));
  }

  /**
   * Middleware
   *
   * See if we have a DB connection, otherwise return a 404
   * @param request {http.IncomingMessage}
   * @param response {http.ServerResponse}
   * @param next {Function} next middleware callback
   */
  handleIndex(request, response, next) {
    response.status(200).send({
      status: "ok",
    });
  }
};
