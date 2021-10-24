const express = require('express')
const expressHandlebars = require('express-handlebars')
const expressSession = require('express-session')
const fileUpload = require('express-fileupload')

const articleRouter = require('./routers/articleRouter')
const faqRouter = require('./routers/faqRouter')
const recipeRouter = require('./routers/recipeRouter')
const authRouter = require('./routers/authRouter')

const app = express()
const { response } = require('express')
const bodyParser = require('body-parser')

//const connectSqlite3 = require('connect-sqlite3')
const SqLiteStore = connectSqlite3(expressSession)

app.use(bodyParser.urlencoded({
	extended: false
}))

app.use(fileUpload())
app.use(express.static(__dirname +'/static/images/'))

//-----------------LOGIN AND SESSION-------------
app.use(expressSession({
	store: new SqLiteStore({ db: "session-db.db" }),
	secret: "bahbahn",
	saveUninitialized: false,
	resave: false,
}))

app.use(function (request, response, next) {
	response.locals.session = request.session
	next()
})

app.get('/logout', function (request, response) {
	request.session.isLoggedIn = false
	response.redirect('/')
})


// Links----------------------------------------------------------------------------------

app.use('/articles', articleRouter)
app.use('/faq', faqRouter)
app.use('/recipes', recipeRouter)
app.use('/auth', authRouter)

app.engine("hbs", expressHandlebars(
	{
		defaultLayout: 'main.hbs'
	}))


app.get('/', function (request, response) {
	response.render("home.hbs")
})

app.get('/about', function (request, response) {
	response.render('about.hbs')
})

app.get('/contact', function (request, response) {
	response.render('contact.hbs')
})

app.listen(8080)