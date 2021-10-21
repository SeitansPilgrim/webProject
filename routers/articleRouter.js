const express = require('express')
const validators = require('../validators')
const db = require('../database')
const csurf = require('csurf')

const csrfProtection = csurf()
const router = express.Router()


router.get('/', csrfProtection, function (request, response) {

    db.GetAllArticles(function (error, Article) {

        if (error) {

            const model =
            {
                hasDatabaseError: true,
                Article: [],
                csrfToken: request.csrfToken()
            }

            response.render('articles.hbs', model)

        } else {

            const model =
            {
                hasDatabaseError: false,
                Article,
                csrfToken: request.csrfToken()
            }

            response.render('articles.hbs', model)
        }
    })
})

//--------------------CREATE ARTICLE-----------------------------------------
router.get('/create', csrfProtection, function (request, response) {

    response.render('createArticle.hbs', { csrfToken: request.csrfToken() })
})

router.get('/:articleID', csrfProtection, function (request, response) {

    const articleID = request.params.articleID

    db.getArticleById(articleID, function (error, Article) {

        if (error) {

            const model =
            {
                hasDatabaseError: true,
                Article: [],
                csrfToken: request.csrfToken()
            }

            response.redirect('articles.hbs', model)

        } else {

            const model =
            {
                Article,
                csrfToken: request.csrfToken()
            }

            response.render('articles.hbs', model)
        }
    })
})

router.post('/create', csrfProtection, function (request, response) {

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
                    article,
                    csrfToken: request.csrfToken()
                }

                response.render('createArticle.hbs', model)

            } else {

                response.redirect('/articles')
            }
        })

    } else {

        const model =
        {
            errors,
            title,
            article,
            csrfToken: request.csrfToken()
        }

        response.render('createArticle.hbs', model)
    }
})
//--------------------/CREATE ARTICLE-----------------------------------------


//--------------------UPDATE ARTICLE-----------------------------------------
router.get('/:articleID/update', csrfProtection, function (request, response) {

    const articleID = request.params.articleID

    db.getArticleById(articleID, function (error, Article) {

        if (error) {

            const model =
            {
                hasDatabaseError: true,
                Article: [],
                csrfToken: request.csrfToken()
            }

            response.render('updateArticle.hbs', model)

        } else {

            const model =
            {
                hasDatabaseError: false,
                Article,
                csrfToken: request.csrfToken()
            }

            response.render('updateArticle.hbs', model)
        }
    })
})

router.post('/:articleID/update', csrfProtection, function (request, response) {

    const articleID = request.params.articleID
    const title = request.body.title
    const article = request.body.article

    const errors = validators.getArticleValidationErrors(title, article)


    if (!request.session.isLoggedIn) {
        errors.push("Not logged in.")
    }

    if (errors.length == 0) {

        db.updateArticleById(articleID, title, article, function (error) {

            if (error) {

                errors.push("Internal server error")

                const model =
                {
                    errors,
                    articleID,
                    title,
                    article,
                    csrfToken: request.csrfToken()
                }

                response.render('updateArticle.hbs', model)

            } else {

                response.redirect('/articles')
            }
        })

    } else {

        const model = {
            errors,
            Article: {
                articleID,
                title,
                article,
            },
            csrfToken: request.csrfToken()
        }

        response.render('updateArticle.hbs', model)
    }
})
//--------------------/UPDATE ARTICLE-----------------------------------------

//--------------------DELETE ARTICLE-----------------------------------------
router.get('/:articleID/delete', csrfProtection, function (request, response) {

    const articleID = request.params.articleID

    db.getArticleById(articleID, function (error, Article) {

        if (error) {

            const model = 
            {
                hasDatabaseError: true,
                Article: [],
                csrfToken: request.csrfToken()
            }

            response.render('deleteArticle.hbs', model)

        } else {

            const model =
            {
                hasDatabaseError: false,
                Article,
                csrfToken: request.csrfToken()
            }

            response.render('deleteArticle.hbs', model)
        }
    })
})


router.post('/:articleID/delete', csrfProtection, function (request, response) {

    const articleID = request.params.articleID

    const errors = validators.getArticleIdValidationErrors(articleID)

    if (!request.session.isLoggedIn) {
        errors.push("Not logged in.")
    }

    if (errors.length == 0) {

        db.deleteArticleById(articleID, function (error) {

            if (error) {

                errors.push("Internal server error")

                const model = 
                {
                    errors,
                    articleID,
                    csrfToken: request.csrfToken()
                }

                response.render('deleteArticle.hbs', model)

            } else {

                response.redirect('/articles')
            }
        })

    } else {

        const model =
        {
            errors,
            Article: {
                articleID,      
            },
            csrfToken: request.csrfToken()
        }

        response.render('deleteArticle.hbs', model)
    }
})
//--------------------DELETE ARTICLE-----------------------------------------

module.exports = router
