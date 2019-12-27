const Joi = require('@hapi/joi')

const schema = Joi.object({
  source: Joi.string().required(),
  destination: Joi.string().required(),
  departureDate: Joi.date().required(),
  returnDate: Joi.date().required()
})

module.exports = schema
