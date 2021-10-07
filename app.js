const express = require('express')
const expressHandlebars = require('express-handlebars')
const { response } = require('express')
const bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.urlencoded({
	extended: false

}))

const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('database.sqlite3')

// Links----------------------------------------------------------------------------------

//Default layout
app.engine("hbs", expressHandlebars(
	{
		defaultLayout: 'main.hbs'
	}))


//DB-------------------------------------------------------------------------
app.get('/faq', function (request, response) {
	db.all("SELECT * FROM FAQ", function (error, FAQ) {

		if (error) {
			const model =
			{
				hasDatabaseError: true,
				FAQ: []
			}

			response.render('faq.hbs', model)
		}

		else {
			const model =
			{
				hasDatabaseError: false,
				FAQ
			}

			response.render('faq.hbs', model)
		}
	})
})


app.get('/recipes', function (request, response) {
	db.all("SELECT * FROM Recipe", function (error, Recipe) {
		if (error) {
			const model =
			{
				hasDatabaseError: true,
				Recipe: []
			}

			response.render('recipes.hbs', model)
		}

		else {
			const model =
			{
				hasDatabaseError: false,
				Recipe
			}

			response.render('recipes.hbs', model)
		}
	})
})


app.get('/reading', function (request, response) {
	db.all("SELECT * FROM Article", function (error, Article) {
		if (error) {
			const model =
			{
				hasDatabaseError: true,
				Article: []
			}

			response.render('reading.hbs', model)
		}

		else {
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

//--------------------CREATE FAQ----------------------------------------------
app.get('/faq/create', function (request, response) {
	response.render('createFaq.hbs')
})

app.post('/faq/create', function (request, response) {
	const question = request.body.question
	const answer = request.body.answer

	const query = "INSERT INTO FAQ(question, answer) VALUES(?,?) "

	const values = [question, answer]

	db.run(query, values, function (error) {
		response.redirect('/faq')
	})
})

app.get('/createFaq', function (request, response) {
	response.render('createFaq.hbs')
})
//--------------------/CREATE FAQ----------------------------------------------


//--------------------CREATE Article-----------------------------------------
app.get('/article/create', function (request, response) {
	response.render('createArticle.hbs')
})

app.post('/article/create', function (request, response) {
	const title = request.body.title
	const article = request.body.article

	const query = "INSERT INTO Article(title, article) VALUES(?,?) "

	const values = [title, article]

	db.run(query, values, function (error) {
		response.redirect('/reading')
	})
})

app.get('/createArticle', function (request, response) {
	response.render('createArticle.hbs')
})
//--------------------/CREATE Article-----------------------------------------



//--------------------CREATE Recipe-----------------------------------------
app.get('/recipe/create', function (request, response) {
	response.render('createRecipe.hbs')
})

app.post('/recipe/create', function (request, response) {
	const recipeName = request.body.recipeName
	const image = request.body.image
	const desc = request.body.desc

	const query = "INSERT INTO Recipe(recipeName, image, desc) VALUES(?,?,?)"

	const values = [recipeName, image, desc]

	db.run(query, values, function (error) {
		response.redirect('/recipes')
	})
})

app.get('/createRecipe', function (request, response) {
	response.render('createRecipe.hbs')
})
//--------------------/CREATE Recipe-----------------------------------------

//--------------------DELETE FAQ-----------------------------------------
function getFaqByID(faqID, callback) {
	const query = "SELECT * FROM FAQ WHERE faqID = ? LIMIT 1"
	const values = [faqID]

	db.get(query, values, function (error, FAQ) {
		callback(error, FAQ)
	})
}

app.get('/faq/:faqID', function (request, response) {
	const faqID = request.params.faqID

	getFaqByID(faqID, function (error, FAQ) {
		const model =
		{
			FAQ
		}

		response.render('faq.hbs', model)
	})
})

app.get('/faq/:faqID/delete', function (request, response) {
	const faqID = request.params.faqID

	getFaqByID(faqID, function (error, FAQ) {
		const model =
		{
			FAQ
		}

		response.render('deleteFaq.hbs', model)
	})
})

app.post('/faq/:faqID/delete', function (request, response) {
	const faqID = request.params.faqID

	const query = "DELETE FROM FAQ WHERE faqID = ?"
	const values = [faqID]

	db.run(query, values, function (error) {
		response.redirect('/faq')
	})
})
//--------------------/DELETE FAQ-----------------------------------------

//--------------------DELETE ARTICLE-----------------------------------------
function getArticleByID(articleID, callback) {
	const query = "SELECT * FROM Article WHERE articleID = ? LIMIT 1"
	const values = [articleID]

	db.get(query, values, function (error, Article) {
		callback(error, Article)
	})
}

app.get('/reading/:articleID', function (request, response) {
	const articleID = request.params.articleID

	getFaqByID(articleID, function (error, Article) {
		const model =
		{
			Article
		}

		response.render('reading.hbs', model)
	})
})

app.get('/reading/:articleID/delete', function (request, response) {
	const articleID = request.params.articleID

	getArticleByID(articleID, function (error, Article) {
		const model =
		{
			Article
		}

		response.render('deleteArticle.hbs', model)
	})
})

app.post('/reading/:articleID/delete', function (request, response) {
	const articleID = request.params.articleID

	const query = "DELETE FROM Article WHERE articleID = ?"
	const values = [articleID]

	db.run(query, values, function (error) {
		response.redirect('/reading')
	})
})
//--------------------/DELETE ARTICLE-----------------------------------------

//--------------------DELETE RECIPE-----------------------------------------
function getRecipeByID(recipeID, callback) {
	
	const query = "SELECT * FROM Recipe WHERE recipeID = ? LIMIT 1"
	const values = [recipeID]

	db.get(query, values, function (error, Recipe) {
		callback(error, Recipe)
	})
}

app.get('/recipes/:recipeID', function (request, response) {
	const recipeID = request.params.recipeID

	getRecipeByID(recipeID, function (error, Recipe) {
		const model =
		{
			Recipe
		}

		response.render('recipes.hbs', model)
	})
})

app.get('/recipes/:recipeID/delete', function (request, response) {
	const recipeID = request.params.recipeID

	getRecipeByID(recipeID, function (error, Recipe) {
		const model =
		{
			Recipe
		}

		response.render('deleteRecipe.hbs', model)
	})
})

app.post('/recipes/:recipeID/delete', function (request, response) {
	const recipeID = request.params.recipeID

	const query = "DELETE FROM Recipe WHERE recipeID = ?"
	const values = [recipeID]

	db.run(query, values, function (error) {
		response.redirect('/recipes')
	})
})
//--------------------/DELETE RECIPE-----------------------------------------






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