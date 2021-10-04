const dummyData = require('./dummydata')

const express = require('express')
const expressHandlebars = require('express-handlebars')
const { response } = require('express')

const app = express()

//database.sqlite3 -------------------------------------------------------------------------
const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('database.sqlite3')


app.get('/recipes', function(request, response){
	
	db.all("SELECT * FROM Post", function(error, Post){
		
		if(error){
			
			const model = {
				hasDatabaseError: true,
				Post: []
			}
			response.render('recipes.hbs', model)
			
		}else{
			
			const model = {
				hasDatabaseError: false,
				Post
			}
			response.render('recipes.hbs', model)
			
		}
	})
})



//----------------------------------------------------------------------------------------



//Default layout
app.engine("hbs", expressHandlebars({
    defaultLayout: 'main.hbs'
}))

// Links----------------------------------------------------------------------------------
app.get('/home', function(request, response){
    const model = {
        humans: dummyData.humans, 
        pets: dummyData.pets
    }
    response.render("index.hbs", model)
})

app.get('/about', function(request,response){
    response.render('about.hbs')
})

app.get('/contact', function(request,response){
    response.render('contact.hbs')
})

app.listen(8080)