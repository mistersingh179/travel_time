var express = require('express')
var path = require('path')
var cors = require('cors')
var cookieParser = require('cookie-parser')
// var logger = require('morgan')
const { rateLimit } = require('./middlewares/rate_limit')

var indexRouter = require('./routes/index')
var usersRouter = require('./routes/users')
var travelRouter = require('./routes/travel')

var app = express()

// app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
// app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static('client/build'))
app.use(rateLimit)

app.use(cors())

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/travel', travelRouter)

app.get('/ping', (req, res, next) => {
  res.status(200).send('pong')
})

module.exports = app
