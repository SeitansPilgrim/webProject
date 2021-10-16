const express = require('express')
const validators = require('../validators')
const csurf = require('csurf')

const csrfProtection = csurf()

const router = express.Router()

const db = require('../database')


router.get('/', csrfProtection, function (request, response) {

    db.getAllRecipes(function (error, Recipe) {

        if (error) {
            const model =
            {
                hasDatabaseError: true,
                Recipe: [],
                csrfToken: request.csrfToken()
            }

            response.render('recipes.hbs', model)
        }

        else {
            const model =
            {
                hasDatabaseError: false,
                Recipe,
                csrfToken: request.csrfToken()
            }

            response.render('recipes.hbs', model)
        }

    })

})

//--------------------CREATE Recipe-----------------------------------------
router.get('/create', csrfProtection, function (request, response) {

    response.render('createRecipe.hbs', { csrfToken: request.csrfToken() })
})

router.get('/:recipeID', csrfProtection, function (request, response) { // get recipe id 

    const recipeID = request.params.recipeID

    db.getRecipeById(recipeID, function (error, Recipe) {

        if (error) {

            const model = {
                hasDatabaseError: true,
                Recipe: [],
                csrfToken: request.csrfToken()
            }

            response.render('recipe.hbs', model)

        } else {

            const model =
            {
                hasDatabaseError:false,
                Recipe,
                csrfToken: request.csrfToken()
            }

            response.render('recipe.hbs', model)
        }
    })
})

router.post('/create', csrfProtection, function (request, response) {

    const name = request.body.name
    //const image = request.body.image
    const desc = request.body.desc
    const uploadedImage = request.files.image

    const imagePath = "C:/Users/sabin/seitanProject/static/images/" + uploadedImage.name
    const image = uploadedImage.name

    const errors = validators.getRecipeValidationErrors(name, desc)

    
    uploadedImage.mv(imagePath, function (error) {
        if (error) {
            errors.push("Failed to upload file")
        }
    })

    if (!request.files || (request.files).length == 0) {
        errors.push("Must upload an image")
    }

    if (!request.session.isLoggedIn) {
        errors.push("Not logged in.")
    }

    if (errors.length == 0) {

        db.createRecipe(name, image, desc, function (error, recipeID) {

            if (error) {

                errors.push("Internal server error.")

                const model =
                {
                    errors,
                    name,
                    image,
                    desc,
                    csrfToken: request.csrfToken()
                }

                response.render('createRecipe.hbs', model)

            } else {

                response.redirect('/recipes')
            }
        })

    } else {

        const model =
        {
            errors,
            name,
            image,
            desc,
            csrfToken: request.csrfToken()
        }

        response.render('createRecipe.hbs', model)
    }

})
//--------------------/CREATE Recipe-----------------------------------------

//--------------------UPDATE RECIPE-----------------------------------------
router.get('/:recipeID/update', csrfProtection, function (request, response) {
    const recipeID = request.params.recipeID

    db.getRecipeById(recipeID, function (error, Recipe) {

        if (error) {

            const model =
            {
                hasDatabaseError: true,
                Recipe: [],
                csrfToken: request.csrfToken()
            }

            response.render('updateRecipe.hbs', model)

        } else {

            const model =
            {
                hasDatabaseError: false,
                Recipe,
                csrfToken: request.csrfToken()
            }

            response.render('updateRecipe.hbs', model)
        }
    })
})


router.post('/:recipeID/update', csrfProtection, function (request, response) {

    const recipeID = request.params.recipeID
    const name = request.body.name
    const desc = request.body.desc

    const errors = validators.getRecipeValidationErrors(name, desc)


    if (!request.session.isLoggedIn) {
        errors.push("Not logged in.")
    }

    if (errors.length == 0) {

        db.updateRecipeById(recipeID, name, desc, function (error) {

            if (error) {

                errors.push("Internal server error")

                const model = {
                    errors,
                    recipeID,
                    name,
                    desc,
                    csrfToken: request.csrfToken()
                }

                response.render('updateRecipe.hbs', model)

            } else {

                response.redirect('/recipes/' + recipeID)
            }
        })

    } else {

        const model = {
            errors,
            Recipe: {
                recipeID,
                name,
                desc,
                csrfToken: request.csrfToken()
            }
        }

        response.render('updateRecipe.hbs', model)
    }
})
//--------------------/UPDATE  RECIPE-----------------------------------------

//--------------------DELETE RECIPE-----------------------------------------
router.get('/:recipeID/delete', csrfProtection, function (request, response) {

    const recipeID = request.params.recipeID

    db.getRecipeById(recipeID, function (error, Recipe) {

        if (error) {

            const model =
            {
                hasDatabaseError: true,
                Recipe: [],
                csrfToken: request.csrfToken()
            }

            response.render('deleteRecipe.hbs', model)

        } else {

            const model =
            {
                Recipe,
                csrfToken: request.csrfToken()
            }

            response.render('deleteRecipe.hbs', model)
        }
    })
})

router.post('/:recipeID/delete', csrfProtection, function (request, response) {

    const recipeID = request.params.recipeID

    const errors = validators.getRecipeIdValidationErrors(recipeID)

    if (!request.session.isLoggedIn) {
        errors.push("Not logged in.")
    }

    if (errors.length == 0) {

        db.deleteRecipeById(recipeID, function (error) {

            if (error) {

                errors.push("Internal server error.")

                const model =
                {
                    errors,
                    recipeID,
                    csrfToken: request.csrfToken()
                }

                response.render('deleteRecipe.hbs', model)

            } else {

                response.redirect('/recipes')
            }
        })

    } else {

        const model =
        {
            errors,
            Recipe: {
                recipeID,
                csrfToken: request.csrfToken()
            }
        }

        response.render('deleteRecipe.hbs', model)
    }
})

//--------------------/DELETE RECIPE-----------------------------------------

module.exports = router