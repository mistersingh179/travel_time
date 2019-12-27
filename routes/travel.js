const express = require('express')
const router = express.Router()
const checkTravelParams = require('../middlewares/checkTravelParams')
const weather = require('weather-js')
const Holidays = require('date-holidays')
const iterateOverDates = require('../lib/iterateOverDates')
const moment = require('moment')
const hd = new Holidays('US')
const schema = require('../schemas/recommendationInput')

router.use(checkTravelParams)

router.get('/recommendation', (req, res, next) => {
  const { value } = schema.validate(req.query || {})
  const { departureDate, returnDate, source, destination } = value
  // console.log('input data is like: ', value)
  let travellingOnHoliday = false
  iterateOverDates(moment(departureDate), moment(returnDate), date => {
    // console.log('checking on ', date.toString(), hd.isHoliday(date))
    if (hd.isHoliday(date)) {
      travellingOnHoliday = true
    }
  })
  // console.log('we have travellingOnHoliday as: ', travellingOnHoliday)
  weather.find({ search: destination }, (err, result) => {
    if (err) next(err)
    else {
      // console.log('weather looks like: ', result)
      if (result && result[0] && result[0].current) {
        if (result[0].current.skytext === 'Rainy') {
          res.status(200).send({ travel: false })
        } else if (travellingOnHoliday === true) {
          res.status(200).send({ travel: false })
        } else {
          res.status(200).send({ travel: true })
        }
      } else {
        res.status(200).send({ travel: false })
      }
    }
  })
})

module.exports = router
