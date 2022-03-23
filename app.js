const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const flash = require('connect-flash')
require('dotenv').config()
let sessionOption = session({
    secret:'cooll app',
    store: MongoStore.create({mongoUrl:process.env.CONNECT_STRING}),
    resave:false,
    saveUninitialized:false,
    cookie:{maxAge:100*60*60*24,httpOnly:true}
})
app.use(sessionOption)
app.use(flash())
const router = require('./router')
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json())
app.use(express.static('public'))
app.use(express.static('upload'))
app.set('views','view')
app.set('view engine','ejs')

app.use('/',router)

module.exports = app
