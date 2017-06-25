const logger = module.exports = require('winston')

logger.add(logger.transports.File, {
  'filename': 'log.log',
  'level': 'debug',
  'handleExceptions': true,
  'humanReadableUnhandledException': true,
  'exitOnError': true,
  'json': false,
  'maxsize': 104857600,
  'maxFiles': 5
})
