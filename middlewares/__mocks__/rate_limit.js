const debug = require('debug')('rate-limit')

let requestCount = 0

const resetRequestCount = () => {
  debug('resetting request count')
  requestCount = 0
}

setInterval(resetRequestCount, 1000)

const rateLimit = (req, res, next) => {
  requestCount = requestCount + 1
  debug('we have request number: ', requestCount)
  next()
}

module.exports = { rateLimit, resetRequestCount }
