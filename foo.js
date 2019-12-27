const weather = require('weather-js')
const { promisify } = require('util')
const findAsync = promisify(weather.find)

const getTheWeather = async (name) => {
  const result = await findAsync({ search: name })
  // console.log(name, result)
  if (result && result[0] && result[0].current && result[0].current) {
    return result[0].current.skytext
  } else {
    throw new Error('weather not found error!')
  }
}

module.exports = getTheWeather
