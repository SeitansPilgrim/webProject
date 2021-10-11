const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('database.sqlite3')

//--------------------GET RECOURCES----------------------------------------------
exports.getAllFaqs = function (callback) {

    const query = "SELECT * FROM FAQ"
    db.all(query, function (error, FAQ) { 
        callback(error, FAQ)
    })
}

exports.getAllRecipes = function (callback) {

    const query = "SELECT * FROM Recipe"

    db.all(query, function (error, Recipe) {
        callback(error, Recipe)
    })
}

exports.GetAllArticles = function (callback) {

    const query = "SELECT * FROM Article"

    db.all(query, function (error, Article) {
        callback(error, Article)
    })
}
//--------------------/GET RECOURCES----------------------------------------------

//-------------------GET RECOURCES BY ID-------------------------------------------

exports.getFaqByID = function(faqID, callback) {
	const query = "SELECT * FROM FAQ WHERE faqID = ? LIMIT 1"
	const values = [faqID]

	db.get(query, values, function (error, FAQ) {
		callback(error, FAQ)
	})
}

exports.getArticleByID = function(articleID, callback) {
	const query = "SELECT * FROM Article WHERE articleID = ? LIMIT 1"
	const values = [articleID]

	db.get(query, values, function (error, Article) {
		callback(error, Article)
	})
}

exports.getRecipeByID = function(recipeID, callback) {

	const query = "SELECT * FROM Recipe WHERE recipeID = ? LIMIT 1"
	const values = [recipeID]

	db.get(query, values, function (error, Recipe) {
		callback(error, Recipe)
	})
}
//-------------------/GET RECOURCES BY ID-------------------------------------------

//--------------------CREATE FAQ----------------------------------------------
exports.createFaq = function (question, answer, callback) { 

    const query = "INSERT INTO FAQ(question, answer) VALUES(?,?) "
    const values = [question, answer]

    db.run(query, values, function (error) {
        callback(error, this.lastID)               
    })
}
//--------------------/CREATE FAQ----------------------------------------------

//--------------------CREATE Article-----------------------------------------
exports.createArticle = function (title, article, callback) {

    const query = "INSERT INTO Article(title, article) VALUES(?,?) "
    const values = [title, article]

    db.run(query, values, function (error) {
        callback(error, this.lastID)                      
    })
}
//--------------------/CREATE Article-----------------------------------------

//--------------------CREATE Recipe-----------------------------------------
exports.createRecipe = function (name, image, desc, callback) {

    const query = "INSERT INTO Recipe(name, image, desc) VALUES(?,?,?)"
    const values = [name, image, desc]

    db.run(query, values, function (error) {
        callback(error, this.lastID)                 
    })
}
//--------------------/CREATE Recipe-----------------------------------------

//---------------------UPDATE  FAQ-----------------------------------------
exports.updateFaqbyID = function (faqID, question, answer, callback) {

    const query = "UPDATE FAQ SET question = ?, answer = ? WHERE faqID = ?"
    const values = [question, answer, faqID]

    db.run(query, values, function (error) {
        callback(error)                               
    })
}
//--------------------/UPDATE  FAQ-----------------------------------------


//--------------------UPDATE  ARTICLE-----------------------------------------
exports.updateArticleById = function (articleID, title, article, callback) {

    const query = "UPDATE Article SET title = ?, article = ? WHERE articleID = ?"
    const values = [title, article, articleID]

    db.run(query, values, function (error) {
        callback(error)                                                  
    })
}
//--------------------/UPDATE  ARTICLE-----------------------------------------


//--------------------UPDATE RECIPE-----------------------------------------
exports.updateRecipeById = function(recipeID, name, desc) {  

		const query = "UPDATE Recipe SET name = ?, desc = ? WHERE recipeID = ?"
		const values = [name, desc, recipeID]

		db.run(query, values, function (error) {
			callback(error)                           
		})
}
//--------------------/UPDATE RECIPE-----------------------------------------

//--------------------DELETE FAQ-----------------------------------------
exports.deleteFaqById = function (faqID, callback) { 

    const query = "DELETE FROM FAQ WHERE faqID = ?"
    const values = [faqID]

    db.run(query, values, function (error) {
        callback(error)                         
    })
}
//--------------------/DELETE FAQ-----------------------------------------


//--------------------DELETE ARTICLE-----------------------------------------
exports.deleteArticleById = function (articleID, callback) { 

    const query = "DELETE FROM Article WHERE articleID = ?"
    const values = [articleID]

    db.run(query, values, function (error) {
        callback(error)                             
    })
}
//--------------------/DELETE ARTICLE-----------------------------------------


//--------------------DELETE RECIPE-----------------------------------------
exports.deleteRecipeById = function (recipeID, callback) { 

    const query = "DELETE FROM Recipe WHERE recipeID = ?"
    const values = [recipeID]

    db.run(query, values, function (error) {
        callback(error)                              
    })
}
//--------------------/DELETE RECIPE-----------------------------------------