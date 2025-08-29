const express = require('express')
const app = express()
const passport = require('passport')
const session = require('express-session') // is gonna handle a generating session id for us
const MongoStore = require('connect-mongo')
const methodOverride = require('method-override') // we need this middleware so that we are able to override the method to (PUT/DELETE)
const flash = require('express-flash')
const logger = require('morgan') // morgan is our logger or very simple kind of debugger. and what is showing us is our log here
const helmet = require('helmet')
const cors = require('cors')
const connectDB = require('./config/database')
const mainRoutes = require('./routes/main')
const bookFormRoutes = require('./routes/bookForm')
const editReservationRoutes = require('./routes/edit')
const adminRoutes = require('./routes/admin')

// Use .env file in config folder (for local development)
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: './config/.env' })
}

// passport config
require('./config/passport')(passport) // CAMBIE (PASSPORT DE ESTAR COMENTADO)

connectDB() // Here is where we are calling our function for connection to the database.

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ['\'self\''],
      scriptSrc: ['\'self\'', 'https://kit.fontawesome.com'],
      styleSrc: ['\'self\'', 'https://fonts.googleapis.com', 'https://ka-f.fontawesome.com', '\'unsafe-inline\''],
      fontSrc: ['\'self\'', 'https://fonts.gstatic.com', 'https://ka-f.fontawesome.com'],
      imgSrc: ['\'self\'', 'data:', 'https:'],
      connectSrc: ['\'self\'', 'https://ka-f.fontawesome.com']
    }
  }
}))

// CORS configuration
app.use(cors())

// Health check route for Railway
app.get('/health', (req, res) => res.send('OK'))

// Using EJS for views
app.set('view engine', 'ejs')

// Static Folder
app.use(express.static('public'))
app.use('/public/imgs/', express.static('./public/imgs'))
// app.use(express.static(__dirname + '/public'));

// body parsing -set up middleware
app.use(express.urlencoded({ extended: true }))// this is just that we can grab every single part of the request been made.(input for example r grabbing a piece of word.)
app.use(express.json())
app.use(logger('dev'))
// Use forms for put / delete
app.use(methodOverride('_method'))

// Setup Sessions - stored in MongoDB
const mongoUrl = process.env.MONGO_URL || process.env.DB_STRING

if (!mongoUrl) {
  console.error('ERROR: No MongoDB connection string found!')
  console.error('Please set either MONGO_URL or DB_STRING environment variable')
  process.exit(1)
}

// Create MongoDB session store
const sessionStore = MongoStore.create({
  mongoUrl: mongoUrl.trim(),
  touchAfter: 24 * 3600, // lazy session update
  stringify: false
})

app.use( // we declare it after express.static, this sessions are gonna keep us logged in throughout different pages.
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret-key-for-development',
    resave: false,
    saveUninitialized: false, //  you wanna make sure its set to false if you have a login system, otherwise is gonna generate a new session id every single time they make a request to your server
    // store: MongoStore.create({ mongoUrl: process.env.DB_STRING }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // equals 1 day (1day *24hrs/1dday *60mi)
      secure: false, // Set to false for development to work with HTTP
      httpOnly: true, // Prevent XSS attacks
      sameSite: 'lax' // CSRF protection
    },
    store: sessionStore,
    rolling: true // Reset expiration on activity
  })
)

// Passport middleware
// everytime we load a route these 2 middlewares are gonna work together
// what they are gonna do is first gonna check to see is the user property is not null
app.use(passport.initialize()) // This is kinda gonna rerun everything that we just did
app.use(passport.session()) // has to do with the serialize and deserialize user, but more so it has to do with the actual express session middleware.
// the request.session gives us access to the request that session object and anything that we store on the request.sessi

app.use(flash())

app.use('/', mainRoutes)
app.use('/bookForm', bookFormRoutes)
app.use('/edit', editReservationRoutes)
app.use('/admin', adminRoutes)

// Check if server is running
const PORT = process.env.PORT || 2121
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}, you better catch it!`)
})

// Graceful shutdown for Railway
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully')
  server.close(() => {
    console.log('Process terminated gracefully')
  })
})

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully')
  server.close(() => {
    console.log('Process terminated gracefully')
  })
})
