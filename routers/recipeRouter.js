const express = require('express')
const db = require('../database')
const validators = require('../validators')
const csurf = require('csurf')
const paginate = require('express-paginate')

const csrfProtection = csurf()
const router = express.Router()


router.use(paginate.middleware(4, 50));

router.get('/', csrfProtection, function (request, response) {

    const page = request.query.page
    const limit = request.query.limit
    const start = (page - 1) * limit
    const last = page * limit

    db.getAllRecipes(start, last, function (error, Recipe) {

        if (error) {

            const model =
            {
                hasDatabaseError: true,
                Recipe: [],
                csrfToken: request.csrfToken()
            }

            response.render('recipes.hbs', model)

        } else {

            const firstPage = 0
            const lastPage = 3
            const morePages = lastPage < Recipe.length
            const nextPage = page + 1
            const previousPage = page - 1

            Recipe.slice(firstPage, lastPage)

            const model =
            {
                hasDatabaseError: false,
                morePages,
                nextPage,
                previousPage,
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

router.get('/:recipeID', csrfProtection, function (request, response) {

    const recipeID = request.params.recipeID

    db.getRecipeById(recipeID, function (error, Recipe) {

        if (error) {

            const model =
            {
                hasDatabaseError: true,
                Recipe: [],
                csrfToken: request.csrfToken()
            }

            response.render('recipe.hbs', model)

        } else {

            const model =
            {
                hasDatabaseError: false,
                Recipe,
                csrfToken: request.csrfToken()
            }

            response.render('recipe.hbs', model)
        }
    })
})

router.post('/create', csrfProtection, function (request, response) {

    const name = request.body.name
    const desc = request.body.desc

    const cookingTime = request.body.cookingTime
    const mainIngredient = request.body.mainIngredient
    const mealType = request.body.mealType

    const errors = validators.getRecipeValidationErrors(name, desc, cookingTime, mainIngredient, mealType)

    if (!request.files || (request.files).length == 0) {
        errors.push("Must upload an image")
    }

    if (!request.session.isLoggedIn) {
        errors.push("Not logged in.")
    }

    if (errors.length == 0) {

        const uploadedImage = request.files.image
        const imagePath = "C:/Users/sabin/seitanProject/static/images/" + uploadedImage.name
        const image = uploadedImage.name

        uploadedImage.mv(imagePath, function (error) {
            if (error) {
                errors.push("Failed to upload the image")
            }
        })

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

                    db.createRecipeTags(recipeID, cookingTime, mainIngredient, mealType, function (error) {

                        if (error) {

                            errors.push("Internal server error.")

                            const model =
                            {
                                errors,
                                cookingTime,
                                mainIngredient,
                                mealType,
                                csrfToken: request.csrfToken()
                            }

                            response.render('createRecipe.hbs', model)

                        } else {

                            response.redirect('/recipes')
                        }
                    })
                }
            })

        } else {

            const model =
            {
                errors,
                image,
                csrfToken: request.csrfToken()
            }

            response.render('createRecipe.hbs', model)
        }

    } else {

        const model =
        {
            errors,
            name,
            desc,
            cookingTime,
            mainIngredient,
            mealType,
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

    const cookingTime = request.body.cookingTime
    const mainIngredient = request.body.mainIngredient
    const mealType = request.body.mealType

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



                db.updateRecipeTagsById(recipeID, cookingTime, mainIngredient, mealType, function (error) {

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


                db.deleteRecipeTagsById(recipeID, function (error) {

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