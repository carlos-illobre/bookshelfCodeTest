const express = require('express')
const bodyParser = require('body-parser')
const winston = require(`${__root_dirname}/logger`)
const expressWinston = require('express-winston')

const router = require('./routerInjector').inject()

module.exports.create = options => express()
.use(expressWinston.logger({
	winstonInstance: winston,
  msg: "{{res.statusCode}} {{req.method}} {{req.url}} {{res.responseTime}}ms",
	meta: false
}))
.use(bodyParser.json())
.use(bodyParser.urlencoded({ extended: true }))
.use(express.static(`${__root_dirname}/client/src`))

.use((req, res, next) => {
	req.domain = `${req.protocol}://${req.get('host')}`
	return next()
})

.use('/', router)

.use((req, res, next) => res.sendStatus(404))
.use((error, req, res, next) => {
	winston.error(error, error)
	res.sendStatus(error.status || 500)
})
