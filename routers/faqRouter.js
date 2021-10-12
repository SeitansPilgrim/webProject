const express = require('express')
const validators = require('../validators')
const router = express.Router()

const db = require('../database')


router.get('/', function (request, response) {

    db.getAllFaqs(function (error, FAQ) {

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


router.get('/:faqID', function (request, response) { // get faq id 

    const faqID = request.params.faqID

    db.getFaqByID(faqID, function (error, FAQ) {
        const model = {
            FAQ
        }
        response.render('faq.hbs')
    })
})

//--------------------CREATE FAQ-----------------------------------------
router.get('/create', function (request, response) {
	response.render('createFaq.hbs')
})

router.post('/create', function (request, response) {

    const question = request.body.question
    const answer = request.body.answer

    const errors = validators.getFaqValidationErrors(question, answer)

    if (!request.session.isLoggedIn) {
        errors.push("Not logged in.")
    }

    if (errors.length == 0) {

        db.createFaq(question, answer, function (error, faqID) {

            if (error) {

                errors.push("Internal server error.")

                const model =
                {
                    errors,
                    question,
                    answer
                }

                response.render('createFaq.hbs')

            } else {

                response.redirect('/')
            }
        })

    } else {

        const model =
        {
            errors,
            question,
            answer
        }

        response.render('createFaq.hbs', model)
    }

})
//--------------------/CREATE FAQ-----------------------------------------

//--------------------UPDATE FAQ-----------------------------------------

router.get('/:faqID/update', function (request, response) {
	const faqID = request.params.faqID

	db.getFaqByID(faqID, function (error, FAQ) {
		const model =
		{
			FAQ
		}

		response.render('updateFaq.hbs', model)
	})
})

router.post('/:faqID/update', function (request, response) {

    const faqID = request.params.faqID                         
    const question = request.body.question
    const answer = request.body.answer

    const errors = validators.getFaqValidationErrors(question, answer)


    if (!request.session.isLoggedIn) {
        errors.push("Not logged in.")
    }

    if (errors.length == 0) {

        db.updateFaqById(faqID, question, answer, function (error) {
            response.redirect('/')
        })

    } else {

        const model = {
            errors,
            FAQ: {
                faqID,
                question,
                answer
            }
        }

        response.render('updateFaq.hbs', model)
    }

})
//--------------------/UPDATE  FAQ-----------------------------------------

//--------------------DELETE FAQ-----------------------------------------
router.get('/:faqID/delete', function (request, response) {
	
    const faqID = request.params.faqID

	db.getFaqByID(faqID, function (error, FAQ) {
		const model =
		{
			FAQ
		}

		response.render('deleteFaq.hbs', model)
	})
})

router.post('/:faqID/delete', function (request, response) {

    const faqID = require.params.faqID

    /*if (!request.session.isLoggedIn) {
        errors.push("Not logged in.")
    } */

    db.deleteFaqById(faqID, function (error) {
        response.redirect('faq.hbs')
    })
})
//--------------------/DELETE FAQ-----------------------------------------


module.exports = router