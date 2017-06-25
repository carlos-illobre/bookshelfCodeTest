global.__root_dirname = __dirname
global.__model_dirname = `${__dirname}/model`
global.__service_dirname = `${__dirname}/service`
global.__enums_dirname = `${__dirname}/enums`

const http = require('http')
const app = require('./app/express-config.js').create()
const logger = require('./logger')
const port = process.env.PORT || 8080

module.exports = http
.createServer(app)
.listen(port)
.on('listening', function() {
	var addr = this.address()
	var bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
	logger.info(`Listening on ${bind}`)
})
.on('error', function(error) {
	if (error.syscall !== 'listen') {
		throw error
	}
	var addr = this.address() || {
		port: port
	}
	var bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`
	switch (error.code) {
		case 'EACCES':
			logger.error(`${bind} requires elevated privileges`)
			process.exit(1)
			break
		case 'EADDRINUSE':
			logger.error(`${bind} is already in use`)
			process.exit(1)
			break
		default:
			throw error
	}
})
