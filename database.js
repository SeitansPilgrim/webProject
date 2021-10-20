const sqlite3 = require('sqlite3')
const db = new sqlite3.Database('database.sqlite3')

db.run(
    `
    CREATE TABLE IF NOT EXISTS "Article" (
        "articleID"	INTEGER,
        "title"	TEXT,
        "article"	TEXT,
        PRIMARY KEY("articleID" AUTOINCREMENT)
    );
`
)

db.run(
    `
    CREATE TABLE IF NOT EXISTS "FAQ" (
        "faqID"	INTEGER,
        "question"	TEXT,
        "answer"	TEXT,
        PRIMARY KEY("faqID" AUTOINCREMENT)
    );
`
)

db.run(
    `
    CREATE TABLE IF NOT EXISTS "Recipe" (
        "recipeID"	INTEGER,
        "name"	TEXT,
        "desc"	TEXT,
        "image"	TEXT,
        PRIMARY KEY("recipeID" AUTOINCREMENT)
    );
`
)

db.run(
    `
    CREATE TABLE IF NOT EXISTS "RecipeTags" (
        "tagID"	INTEGER,
        "recipeID"	INTEGER,
        "cookingTime"	TEXT,
        "mainIngredient"	TEXT,
        "mealType"	TEXT,
        PRIMARY KEY("tagID" AUTOINCREMENT),
        FOREIGN KEY("recipeID") REFERENCES "Recipe"("recipeID") ON DELETE CASCADE
    );
`
)

//GET RECOURCES--------------------------------------------------------------------------------------------------
exports.getAllFaqs = function (callback) {

    const query = "SELECT * FROM FAQ ORDER BY faqID DESC"
    db.all(query, function (error, FAQ) {
        callback(error, FAQ)
    })
}

exports.getAllRecipes = function (start, last, callback) {

    const query = "SELECT * FROM Recipe JOIN RecipeTags ON Recipe.recipeID = RecipeTags.recipeID ORDER BY recipeID DESC LIMIT ?,?"
    const values = [start, last]

    db.all(query, values, function (error, Recipe) {
        callback(error, Recipe)
    })
}

exports.GetAllArticles = function (callback) {

    const query = "SELECT * FROM Article ORDER BY articleID DESC"

    db.all(query, function (error, Article) {
        callback(error, Article)
    })
}


//GET RECOURCES BY ID--------------------------------------------------------------------------------------------

exports.getFaqById = function (faqID, callback) {
    const query = "SELECT * FROM FAQ WHERE faqID = ? LIMIT 1"
    const values = [faqID]

    db.get(query, values, function (error, FAQ) {

        if (FAQ == undefined) {

            const model =
            {
                error,
                FAQ
            }

            callback(model)

        } else {
            callback(error, FAQ)
        }

    })
}

exports.getArticleById = function (articleID, callback) {
    const query = "SELECT * FROM Article WHERE articleID = ? LIMIT 1"
    const values = [articleID]

    db.get(query, values, function (error, Article) {

        if (Article == undefined) {

            const model =
            {
                error,
                Article
            }

            callback(model)

        } else {
            callback(error, Article)
        }
    })
}

exports.getRecipeById = function (recipeID, callback) {

    const query = "SELECT * FROM Recipe WHERE recipeID = ? LIMIT 1"
    const values = [recipeID]

    db.get(query, values, function (error, Recipe) {

        if (Recipe == undefined) {

            const model =
            {
                error,
                Recipe
            }

            callback(model)

        } else {

            callback(error, Recipe)
        }
    })
}


//CREATE FAQ-----------------------------------------------------------------------------------------------------
exports.createFaq = function (question, answer, callback) {

    const query = "INSERT INTO FAQ(question, answer) VALUES(?,?) "
    const values = [question, answer]

    db.run(query, values, function (error) {
        callback(error, this.lastID)
    })
}


//CREATE Article-------------------------------------------------------------------------------------------------
exports.createArticle = function (title, article, callback) {

    const query = "INSERT INTO Article(title, article) VALUES(?,?) "
    const values = [title, article]

    db.run(query, values, function (error) {
        callback(error, this.lastID)
    })
}


//CREATE Recipe--------------------------------------------------------------------------------------------------
exports.createRecipe = function (name, image, desc, callback) {

    const query = "INSERT INTO Recipe(name, image, desc) VALUES(?,?,?)"
    const values = [name, image, desc]

    db.run(query, values, function (error) {
        callback(error, this.lastID)
    })
}

exports.createRecipeTags = function (recipeID, cookingTime, mainIngredient, mealType, callback) {

    const query = "INSERT INTO RecipeTags(recipeID, cookingTime, mainIngredient, mealType) VALUES(?,?,?,?)"
    const values = [recipeID, cookingTime, mainIngredient, mealType]

    db.run(query, values, function (error) {
        callback(error, this.lastID)
    })
}


//UPDATE  FAQ----------------------------------------------------------------------------------------------------
exports.updateFaqbyId = function (faqID, question, answer, callback) {

    const query = "UPDATE FAQ SET question = ?, answer = ? WHERE faqID = ?"
    const values = [question, answer, faqID]

    db.run(query, values, function (error) {
        callback(error)
    })
}


//UPDATE  ARTICLE------------------------------------------------------------------------------------------------
exports.updateArticleById = function (articleID, title, article, callback) {

    const query = "UPDATE Article SET title = ?, article = ? WHERE articleID = ?"
    const values = [title, article, articleID]

    db.run(query, values, function (error) {
        callback(error)
    })
}


//UPDATE RECIPE--------------------------------------------------------------------------------------------------
exports.updateRecipeById = function (recipeID, name, desc, callback) {

    const query = "UPDATE Recipe SET name = ?, desc = ? WHERE recipeID = ?"
    const values = [name, desc, recipeID]

    db.run(query, values, function (error) {
        callback(error)
    })
}

exports.updateRecipeTagsById = function (recipeID, cookingTime, mainIngredient, mealType, callback) {

    const query = "UPDATE RecipeTags SET cookingTime = ?, mainIngredient = ?, mealType = ? WHERE recipeID = ?"
    const values = [cookingTime, mainIngredient, mealType, recipeID]

    db.run(query, values, function (error) {
        callback(error)
    })
}


//DELETE FAQ----------------------------------------------------------------------------------------------------
exports.deleteFaqById = function (faqID, callback) {

    const query = "DELETE FROM FAQ WHERE faqID = ?"
    const values = [faqID]

    db.run(query, values, function (error) {

        callback(error)
    })
}


//DELETE ARTICLE-------------------------------------------------------------------------------------------------
exports.deleteArticleById = function (articleID, callback) {

    const query = "DELETE FROM Article WHERE articleID = ?"
    const values = [articleID]

    db.run(query, values, function (error) {
        callback(error)
    })
}


//DELETE RECIPE--------------------------------------------------------------------------------------------------
exports.deleteRecipeById = function (recipeID, callback) {

    const query = "DELETE FROM Recipe WHERE recipeID = ?"
    const values = [recipeID]

    db.run(query, values, function (error) {
        callback(error)
    })
}

exports.deleteRecipeTagsById = function (recipeID, callback) {

    const query = "DELETE FROM RecipeTags WHERE recipeID = ?"
    const values = [recipeID]

    db.run(query, values, function (error) {
        callback(error)
    })
}