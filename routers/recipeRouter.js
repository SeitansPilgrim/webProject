const express = require('express')
const validators = require('../validators')
const router = express.Router()

const db = require('../database')


router.get('/', function (request, response) {

    db.getAllRecipes(function (error, Recipe) {

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

router.get('/:recipeID', function (request, response) { // get recipe id 

    const recipeID = request.params.recipeID

    db.getRecipeByID(recipeID, function (error, Recipe) {
        const model = {
            Recipe
        }
        response.render('recipes.hbs')
    })
})



//--------------------CREATE Recipe-----------------------------------------
router.get('/recipe/create', function (request, response) {
	response.render('createRecipe.hbs')
})

router.get('/createRecipe', function (request, response) {
	response.render('createRecipe.hbs')
})

router.post('/recipe/create', function (request, response) {

    const name = request.body.name                         
    const image = request.body.image                        
    const desc = request.body.desc     

    const errors = validators.getRecipeValidationErrors(name, desc)

    if (!request.session.isLoggedIn) {
        errors.push("Not logged in.")
    }

    if (errors.length == 0) {

        db.createFaq(name, image, desc, function (error, recipeID) {

            if (error) {

                errors.push("Internal server error.")

                const model =
                {
                    errors,
                    name,
                    image, 
                    desc
                }

                response.render('createRecipe.hbs')

            } else {

                response.redirect('/')
            }
        })

    } else {

        const model =
        {
            errors,
            name,
            image, 
            desc
        }

        response.render('createRecipe.hbs', model)
    }

})
//--------------------/CREATE Recipe-----------------------------------------

//--------------------UPDATE RECIPE-----------------------------------------
router.get('/:recipeID/update', function (request, response) {
	const recipeID = request.params.recipeID

	getRecipeByID(recipeID, function (error, Recipe) {
		const model =
		{
			Recipe
		}

		response.render('updateRecipe.hbs', model)
	})
})


router.post('/:recipeID/update', function (request, response) {

    const recipeID = request.params.recipeID                         
    const name = request.body.name
    const desc = request.body.desc

    const errors = validators.getRecipeValidationErrors(name, desc)


    if (!request.session.isLoggedIn) {
        errors.push("Not logged in.")
    }

    if (errors.length == 0) {

        db.updateFaqById(recipeID, name, desc, function (error) {
            response.redirect('/')
        })

    } else {

        const model = {
            errors,
            Recipe: {
                recipeID,
                name,
                desc
            }
        }

        response.render('updateRecipe.hbs', model)
    }
})
//--------------------/UPDATE  RECIPE-----------------------------------------

//--------------------DELETE RECIPE-----------------------------------------
router.get('/:recipeID/delete', function (request, response) {
	
    const recipeID = request.params.recipeID

	db.getRecipeByID(recipeID, function (error, Recipe) {
		const model =
		{
			Recipe
		}

		response.render('deleteRecipe.hbs', model)
	})
})

router.post('/:recipeID/delete', function (request, response) {

    const recipeID = require.params.recipeID

    /*if (!request.session.isLoggedIn) {
        errors.push("Not logged in.")
    } */

    db.deleteRecipeById(recipeID, function (error) {
        response.redirect('/recipes.hbs')
    })
})
//--------------------/DELETE RECIPE-----------------------------------------

module.exports = router