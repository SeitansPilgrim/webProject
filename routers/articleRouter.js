const express = require('express')
const validators = require('../validators')
const router = express.Router()

const db = require('../database')


router.get('/', function (request, response) {

    db.GetAllArticles(function (error, Article) {

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

router.get('/:articleID', function (request, response) { // get article id

    const articleID = request.params.articleID

    db.getArticleByID(articleID, function (error, Article) {
        const model = {
            Article
        }
        response.render('reading.hbs')
    })
})

//--------------------CREATE ARTICLE-----------------------------------------
router.get('/article/create', function (request, response) {
    response.render('createArticle.hbs')
})

router.get('/createArticle', function (request, response) {
	response.render('createArticle.hbs')
})

router.post('/article/create', function (request, response) {

    const title = request.body.title
    const article = request.body.article

    const errors = validators.getArticleValidationErrors(title, article)

    if (!request.session.isLoggedIn) {
        errors.push("Not logged in.")
    }

    if (errors.length == 0) {

        db.createArticle(title, article, function (error, articleID) {

            if (error) {

                errors.push("Internal server error.")

                const model =
                {
                    errors,
                    title,
                    article
                }

                response.render('createArticle.hbs')

            } else {

                response.redirect('/')
            }
        })

    } else {

        const model =
        {
            errors,
            title,
            article
        }

        response.render('createArticle.hbs', model)
    }

})
//--------------------/CREATE ARTICLE-----------------------------------------


//--------------------UPDATE ARTICLE-----------------------------------------
router.get('/:articleID/update', function (request, response) {

    const articleID = request.params.articleID

    db.getArticleByID(articleID, function (error, Article) {

        const model = {
            Article
        }

        response.render('updateArticle.hbs')
    })
})

router.post('/:articleID/update', function (request, response) {

    const articleID = request.params.articleID                         
    const title = request.body.title
    const article = request.body.article

    const errors = validators.getArticleValidationErrors(title, article)


    if (!request.session.isLoggedIn) {
        errors.push("Not logged in.")
    }

    if (errors.length == 0) {

        db.updateArticleById(articleID, title, article, function (error) {
            response.redirect('/')
        })

    } else {

        const model = {
            errors,
            Article: {
                articleID,
                title,
                article
            }
        }

        response.render('updateArticle.hbs', model)
    }

})
//--------------------/UPDATE ARTICLE-----------------------------------------

//--------------------DELETE ARTICLE-----------------------------------------
router.get('/:articleID/delete', function (request, response) {

    const articleID = require.params.articleID

    db.getArticleByID(articleID, function (error, Article) {

        const model = {
            Article
        }

        response.render('deleteArticle.hbs')
    })
})


router.post('/:articleID/delete', function (request, response) {

    const articleId = require.params.articleID

    /*if (!request.session.isLoggedIn) {
        errors.push("Not logged in.")
    } */

    db.deleteArticleById(articleID, function (error) {
        response.redirect('/')
    })
})
//--------------------DELETE ARTICLE-----------------------------------------

module.exports = router
