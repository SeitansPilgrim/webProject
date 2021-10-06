const express = require('express')
const expressHandlebars = require('express-handlebars')
const { response } = require('express')

const app = express()

//database.sqlite3 -------------------------------------------------------------------------
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('database.sqlite3')

//Default layout
app.engine("hbs", expressHandlebars({
    defaultLayout: 'main.hbs'
}))


app.get('/faq', function(request, response)
{	
	db.all("SELECT Post.postID, FAQ.question, FAQ.anwser FROM Post JOIN FAQ ON FAQ.postID = Post.postID"
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
	db.all("SELECT Post.postID, Recipe.name, Recipe.desc FROM Post JOIN Recipe ON Recipe.postID = Post.postID"
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
	db.all("SELECT Post.postID, Article.title, Article.article FROM Post JOIN Article ON Article.postID = Post.postID"
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



// Links----------------------------------------------------------------------------------
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