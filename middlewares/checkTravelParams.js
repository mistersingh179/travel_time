const schema = require('../schemas/recommendationInput')

const travelParams = (req, res, next) => {
  const { error } = schema.validate(req.query || {})
  if (error && error.details.length >= 1) {
    res.status(422).send(error)
  } else {
    next()
  }
}

module.exports = travelParams
