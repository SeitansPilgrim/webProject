const express = require('express')
const expressHandlebars = require('express-handlebars')
const { response } = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded ({
	extended: false

}))

const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('database.sqlite3')

// Links----------------------------------------------------------------------------------

//Default layout
app.engine("hbs", expressHandlebars({
    defaultLayout: 'main.hbs'
}))


//DB-------------------------------------------------------------------------
app.get('/faq', function(request, response)
{	
	db.all("SELECT * FROM FAQ"
	     , function(error, FAQ){
		
		if(error)
		{
			const model = 
			{
				hasDatabaseError: true,
				FAQ: []
			}

			response.render('faq.hbs', model)	
		}
		
		else
		{
			const model = 
			{
				hasDatabaseError: false,
				FAQ
			}

			response.render('faq.hbs', model)
		}
	})
})


app.get('/recipes', function(request, response)
{
	db.all("SELECT * FROM Recipe"
	     , function(error, Recipe)
	{
		if(error)
		{
			const model = 
			{
				hasDatabaseError: true,
				Recipe: []
			}

			response.render('recipes.hbs', model)	
		}
		
		else
		{
			
			const model = 
			{
				hasDatabaseError: false,
				Recipe
			}
			response.render('recipes.hbs', model)
			
		}
	})
})

app.get('/reading', function(request, response)
{
	db.all("SELECT * FROM Article"
	     , function(error, Article)
	{
		if(error)
		{
			const model = 
			{
				hasDatabaseError: true,
				Article: []
			}

			response.render('reading.hbs', model)	
		}
		
		else
		{
			
			const model = 
			{
				hasDatabaseError: false,
				Article
			}
			response.render('reading.hbs', model)
			
		}
	})
})
//\DB-------------------------------------------------------------------------

//CRUD-----------------------------------------------------------------------

app.get('/faq/create', function(request, response){
	response.render('createFaq.hbs')
})

app.post('/faq/create', function(request, response){
	const question = request.body.question
	const answer = request.body.answer

	const query = "INSERT INTO FAQ(question, answer) VALUES(?,?) "

	const values = [question, answer]

	db.run(query, values, function(error){
		response.redirect('/faq')
	})
})

app.get('/createFaq', function(request, response){
	response.render('createFaq.hbs')

})

app.get('/', function(request, response){
    response.render("home.hbs")
})

app.get('/about', function(request,response){
    response.render('about.hbs')
})

app.get('/contact', function(request,response){
    response.render('contact.hbs')
})

app.listen(8080)