const path = require('path')
const express = require('express')
//!Change: Mongoose is no longer required
//const mongoose = require('mongoose')
const dotenv = require('dotenv')
const morgan = require('morgan')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
//!Change: MongoStore does not requre (session)
const MongoStore = require('connect-mongo')//(session)
const connectDB = require('./config/db')

// LOAD CONFIG
dotenv.config({path: './config/config.env'})

//LOAD PASSPORT
require('./config/passport')(passport)

connectDB()

const app = express()

//BODY PARSER
app.use(express.urlencoded({ extended: false}))
app.use(express.json())

//DETERMINE LEVEL OF LOGGING
if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

//HELPERS
const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs')

//Handlebars
app.engine(
    '.hbs', 
    //!Change: add '.engine' after exphbs
    exphbs.engine({
        helpers: {
            formatDate,
            stripTags,
            truncate,
            editIcon,
            select
        },
        defaultLayout: 'main',
        extname: '.hbs'
    })
);
app.set('view engine', '.hbs');

// SESSIONS
app.use(
    session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: false,
      //!Change: MongoStore syntax has changed
      store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
      })
    })
  )

// PASSPORT MIDDLEWARE
app.use(passport.initialize())
app.use(passport.session())

//SET GLOBAL VARIABLE
app.use(function(req, res, next){
    res.locals.user = req.user || null
    next()
})

//STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')))

//ROUTES
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/stories', require('./routes/stories'))

const PORT = process.env.PORT || 8500

app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`))