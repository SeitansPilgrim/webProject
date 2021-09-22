const dummyData = require('./dummydata')
const express = require('express')
const expressHandlebars = require('express-handlebars')
const { response } = require('express')

const app = express()

app.engine("hbs", expressHandlebars({
    defaultLayout: 'main.hbs'
}))

app.get('/', function(request, response){
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

app.get('/recipes', function(request,response){
    response.render('recipes.hbs')
})


app.listen(8080)