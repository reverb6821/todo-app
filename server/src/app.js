require('dotenv').config()

const express = require('express')
const app = express()
const cors = require('cors')
const morganMiddleware = require('./middleware/morgan')
const winston = require('./config/winston')
const port = 3000
const db = require('./models')
const cookieSession = require('cookie-session');
const Logger = require('./config/winston')
// ? cors
const corsOptions = {
  origin: 'http://localhost:8081',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions))
//* cookies
app.use(
  cookieSession({
    name: 'todoapp-session',
    secret: 'COOKIE_SECRET', 
    httpOnly: true,
    sameSite: 'strict'
  })
);

//* parse requests of content-type - application/json
app.use(express.json())

//* use morgan
app.use(morganMiddleware)

//* parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))

//* logger
app.use('/logger', (_, res) => {
  winston.error('ERROR : ')
  winston.warn('WARNING : ')
  winston.info('INFO : ')
  winston.http('HTTP LOG : ')
  winston.debug('DEBUG : ')
})

//* simple route
app.get('/', (req, res) => {
  res.json(
    { 
      message: 'Welcome to TODOapp.', 
      status: 200,
    }
  )
})

app.get('*', function(req, res){
  res.json(
    { 
      message: 'Welcome to TODOapp.',
      error: 404, 
    }
  )
});


//* app routes
require('./routes/auth.routes')(app)
require('./routes/user.routes')(app)

app.get('/', function (req, res) {
  throw new Error('error thrown navigating to')
})

db.sequelize.sync()
  .then(() => {
    Logger.info('Synced db.')
  })
  .catch((err) => {
    Logger.error(`Failed to sync db: ${err.message}`)
  });

app.use(function (err, req, res, next) {
  winston.error(`${req.method} - ${err.message}  - ${req.originalUrl} - ${req.ip}`)
  next(err)
})

app.listen(port, () => winston.info(`listening at port ${port}`))