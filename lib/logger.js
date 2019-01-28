const log4js = require('log4js')
const loggerName = 'app'
const logger = log4js.getLogger(loggerName)

log4js.configure({
  appenders: {
    app: {
      type: 'console',
      filename: `logs/${loggerName}.log`
    },
  },
  categories: {
    default: {
      appenders: [loggerName],
      level: 'all'
    }
  }
})

module.exports = logger
