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

app.get('/reading', function(request, response)
{	
	db.all("SELECT Post.postID, Article.title, Article.article, Image.image FROM Post JOIN Article ON Article.postID = Post.postID JOIN Image ON Image.postID = Article.postID "
	    , function(error, Post)
	{	
		if(error)
		{	
			const model = 
			{
				hasDatabaseError: true,
				Post: []
			}

			response.render('reading.hbs', model)	
		}
		
		else
		{
			const model = 
			{
				hasDatabaseError: false,
				Post
			}

			response.render('reading.hbs', model)
		}
	})
})


app.get('/faq', function(request, response)
{	
	db.all("SELECT Post.postID, FAQ.question, FAQ.anwser FROM Post JOIN FAQ ON FAQ.postID = Post.postID"
	     , function(error, Post){
		
		if(error)
		{
			const model = 
			{
				hasDatabaseError: true,
				Post: []
			}

			response.render('faq.hbs', model)	
		}
		
		else
		{
			const model = 
			{
				hasDatabaseError: false,
				Post
			}

			response.render('faq.hbs', model)
		}
	})
})


app.get('/recipes', function(request, response)
{
	db.all("SELECT Post.postID, Recipe.name, Recipe.desc FROM Post JOIN Recipe ON Recipe.postID = Post.postID"
	     , function(error, Post)
	{
		if(error)
		{
			const model = 
			{
				hasDatabaseError: true,
				Post: []
			}

			response.render('recipes.hbs', model)	
		}
		
		else
		{
			
			const model = 
			{
				hasDatabaseError: false,
				Post
			}
			response.render('recipes.hbs', model)
			
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