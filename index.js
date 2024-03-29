/**
 * @fileoverview Notificare Live API Console
 * Main Node file
 */

import http from 'node:http'
import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
import Resource from './resources/index.js'
import winston from 'winston'
import sockjs from 'sockjs'
import { PassThrough } from 'node:stream'
import fs from 'node:fs'
import util from 'node:util'
import minimist from 'minimist'

const args = minimist(process.argv.slice(2))

/**
 * Close stdout and stderr and replace with handles to log files
 */
function reopenLogfiles() {
  if (args && args.l) {
    fs.closeSync(1)
    fs.openSync(args.l, 'a+')
    fs.closeSync(2)
    fs.openSync(args.l, 'a+')
  }
}
reopenLogfiles()

// Create an ExpressJS app
const app = express()

app.set('liveApiConfig', {
  privateKey: process.env.PRIVATE_KEY,
  publicKey: process.env.PUBLIC_KEY,
})

const env = process.env.NODE_ENV || 'development'
if (env === 'development') {
  /**
   * local environment configuration
   */
  app.set('baseUrl', process.env.BASE_URL || 'http://localhost:3006')
  app.set(
    'logger',
    winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: 'debug',
          handleExceptions: true,
          format: winston.format.combine(
            winston.format.splat(),
            winston.format.metadata(),
            winston.format.timestamp({ format: Date }),
            winston.format.colorize(),
            winston.format.printf(
              (info) =>
                `${info.timestamp} - ${info.level}: ${
                  info.message
                } ${util.format(info.metadata)}`
            )
          ),
        }),
      ],
    })
  )
} else {
  /**
   * production environment configuration
   */
  app.enable('trust proxy')
  app.set('baseUrl', process.env.BASE_URL || 'https://push.notifica.re')
  app.set(
    'logger',
    winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: 'info',
          handleExceptions: true,
          format: winston.format.combine(
            winston.format.splat(),
            winston.format.metadata(),
            winston.format.timestamp({ format: Date }),
            winston.format.printf(
              (info) =>
                `${info.timestamp} - ${info.level}: ${
                  info.message
                } ${util.format(info.metadata)}`
            )
          ),
        }),
      ],
    })
  )
}

app.use(
  morgan(
    ':remote-addr - - [:date] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"'
  )
)
app.use(bodyParser.text({ type: 'json' }))
app.use(express.static(`./public`))

/**
 * Map routes to resource namespaces, pass along the Express app instance
 */
app.use('/status', new Resource.Status().attach(app))
app.use('/live', new Resource.Live().attach(app))

/**
 * Generic error handler
 */
app.use(function (err, request, response, next) {
  if (err.status && err.status < 500) {
    app.get('logger').error('Non-fatal error: %s', err.message, { error: err })
    response.status(err.status).send({ error: err.message })
  } else {
    app.get('logger').error('Fatal error: %s', err.message, { error: err })
    response.status(500).send({ error: 'Fail whale' })
  }
})

/**
 * Log startup info through the current logger mechanism
 * @type {winston.Logger}
 */
const logger = app.get('logger')

/**
 * Message queue to send data to that will go to sockjs connections
 * @type {module:stream.internal.PassThrough}
 */
const messageQueue = new PassThrough({ objectMode: true })
app.set('messageQueue', messageQueue)

/**
 * Start listening for incoming requests
 */
// Ready to go
const port = parseInt(process.env.PORT) || 3014
const backlog = parseInt(process.env.BACKLOG) || 2048
const server = http.createServer(app)
server.listen(port, backlog, function () {
  logger.info('Listening on %s', port)
})

// Lifecycle event handling

server.on('close', function () {
  logger.info('Server closed')
  process.exit(0)
})

const sockJS = sockjs.createServer()
sockJS.on('connection', function (connection) {
  messageQueue.pipe(connection)
  connection.on('close', function () {})
})

sockJS.installHandlers(server, { prefix: '/sockjs' })

process.on('SIGHUP', function () {
  logger.info('Got SIGHUP, reopening logfiles')
  reopenLogfiles()
})

// When running in cluster, master will send a message to reopen logfiles
process.on('message', function (message) {
  if (message === 'reopenLogfiles') {
    logger.info('Got reopenLogfiles message from master, reopening logfiles')
    reopenLogfiles()
  }
})

process.on('SIGTERM', function () {
  logger.info('Got TERM signal, closing server')
  server.close()
})

export default app
