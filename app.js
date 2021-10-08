const express = require('express')
const expressHandlebars = require('express-handlebars')
const { response } = require('express')
const bodyParser = require('body-parser')

const expressSession = require('express-session')
const connectSqlite3 = require('connect-sqlite3')
const SqLiteStore = connectSqlite3(expressSession)

const app = express()

const MIN_QUESTION_LENGTH = 1;
const MIN_ANSWER_LENGTH = 1;
const MIN_TITLE_LENGTH = 1;
const MIN_ARTICLE_LENGTH = 1;
const MIN_NAME_LENGTH = 1;
const MIN_DESC_LENGTH = 1;

app.use(bodyParser.urlencoded({
	extended: false

}))

//-----------------LOGIN AND SESSION-------------
const ADMIN_USERNAME = 's'
const ADMIN_PASSWORD = 's'

app.use(expressSession({
	store: new SqLiteStore({ db: "session-db.db" }),
	secret: "bahbahn",
	saveUninitialized: false,
	resave: false,
}))

app.use(function (request, response, next) {
	// Makes the session available to all views.
	response.locals.session = request.session
	next()
})

app.get('/login', function (request, response) {
	response.render('login.hbs')
})

app.post('/login', function (request, response) {

	const username = request.body.username
	const password = request.body.password

	if (username == ADMIN_USERNAME && password == ADMIN_PASSWORD) {
		request.session.isLoggedIn = true
		// TODO: Do something better than redirecting to start page.
		response.redirect('/')
	}

	else {
		// TODO: Display error message to the user.
		response.render('login.hbs')
	}

})

app.get('/logout', function (request, response) {
	request.session.isLoggedIn = false
	response.redirect('/')
})
//-----------------/LOGIN----------------------------------------------------------------

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
	const name = request.body.name
	const image = request.body.image
	const desc = request.body.desc

	const query = "INSERT INTO Recipe(name, image, desc) VALUES(?,?,?)"

	const values = [name, image, desc]

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

//--------------------UPDATE FAQ-----------------------------------------

function getFaqValidationErrors(question, answer) {
	const validationErrors = []

	if (question.length < MIN_QUESTION_LENGTH) {
		validationErrors.push("Question must be at least " + MIN_QUESTION_LENGTH + " characters")
	}

	if (answer.length < MIN_ANSWER_LENGTH) {
		validationErrors.push("Answer must be at least " + MIN_ANSWER_LENGTH + " characters")
	}
	return validationErrors
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

app.get('/faq/:faqID/update', function (request, response) {
	const faqID = request.params.faqID

	getFaqByID(faqID, function (error, FAQ) {
		const model =
		{
			FAQ
		}

		response.render('updateFaq.hbs', model)
	})
})

app.post('/faq/:faqID/update', function (request, response) {
	const faqID = request.params.faqID
	const question = request.body.question
	const answer = request.body.answer
	const errors = getFaqValidationErrors(question, answer)

	if (errors.length == 0) {
		const query = "UPDATE FAQ SET question = ?, answer = ? WHERE faqID = ?"
		const values = [question, answer, faqID]

		db.run(query, values, function (error) {
			response.redirect('/faq')
		})
	}

	else {
		const model =
		{
			errors, FAQ:
			{
				faqID,
				question,
				answer
			}
		}

		response.render('updateFaq.hbs', model)
	}
})
//--------------------/UPDATE  FAQ-----------------------------------------

//--------------------UPDATE ARTICLE-----------------------------------------

function getArticleValidationErrors(title, article) {
	const validationErrors = []

	if (title.length < MIN_TITLE_LENGTH) {
		validationErrors.push("Title must be at least " + MIN_TITLE_LENGTH + " characters")
	}

	if (article.length < MIN_ARTICLE_LENGTH) {
		validationErrors.push("Article must be at least " + MIN_ARTICLE_LENGTH + " characters")
	}
	return validationErrors
}

app.get('/reading/:articleID', function (request, response) {
	const articleID = request.params.articleID

	getArticleByID(articleID, function (error, Article) {
		const model =
		{
			Article
		}

		response.render('reading.hbs', model)
	})
})

app.get('/reading/:articleID/update', function (request, response) {
	const articleID = request.params.articleID

	getArticleByID(articleID, function (error, Article) {
		const model =
		{
			Article
		}

		response.render('updateArticle.hbs', model)
	})
})

app.post('/reading/:articleID/update', function (request, response) {
	const articleID = request.params.articleID
	const title = request.body.title
	const article = request.body.article
	const errors = getArticleValidationErrors(title, article)

	if (errors.length == 0) {
		const query = "UPDATE Article SET title = ?, article = ? WHERE articleID = ?"
		const values = [title, article, articleID]

		db.run(query, values, function (error) {
			response.redirect('/reading')
		})
	}

	else {
		const model =
		{
			errors, Article:
			{
				articleID,
				title,
				article
			}
		}

		response.render('updateArticle.hbs', model)
	}
})
//--------------------/UPDATE  ARTICLE-----------------------------------------

//--------------------UPDATE RECIPE-----------------------------------------

function getRecipeValidationErrors(name, desc) {
	const validationErrors = []

	if (name.length < MIN_NAME_LENGTH) {
		validationErrors.push("Name must be at least " + MIN_NAME_LENGTH + " characters")
	}

	if (desc.length < MIN_DESC_LENGTH) {
		validationErrors.push("Description must be at least " + MIN_DESC_LENGTH + " characters")
	}
	return validationErrors
}

app.get('/recipes/:recipeID/update', function (request, response) {
	const recipeID = request.params.recipeID

	getRecipeByID(recipeID, function (error, Recipe) {
		const model =
		{
			Recipe
		}

		response.render('updateRecipe.hbs', model)
	})
})

app.post('/recipes/:recipeID/update', function (request, response) {
	const recipeID = request.params.recipeID
	const name = request.body.name
	const desc = request.body.desc
	const errors = getRecipeValidationErrors(name, desc)

	if (errors.length == 0) {
		const query = "UPDATE Recipe SET name = ?, desc = ? WHERE recipeID = ?"
		const values = [name, desc, recipeID]

		db.run(query, values, function (error) {
			response.redirect('/recipes')
		})
	}

	else {
		const model =
		{
			errors, Recipe:
			{
				recipeID,
				name,
				desc
			}
		}

		response.render('updateRecipe.hbs', model)
	}
})
//--------------------/UPDATE  ARTICLE-----------------------------------------

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