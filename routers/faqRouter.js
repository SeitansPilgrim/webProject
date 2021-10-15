const express = require('express')
const validators = require('../validators')
const csurf = require('csurf')

const csrfProtection = csurf()

const router = express.Router()

const db = require('../database')


router.get('/', csrfProtection, function (request, response) {

    db.getAllFaqs(function (error, FAQ) {

        if (error) {

            const model =
            {
                hasDatabaseError: true,
                FAQ: [],
                csrfToken: request.csrfToken()
            }

            response.render('faq.hbs', model)
        }

        else {
            
            const model =
            {
                hasDatabaseError: false,
                FAQ,
                csrfToken: request.csrfToken()
            }

            response.render('faq.hbs', model)
        }
    })
})

//--------------------CREATE FAQ------------------------------------------
router.get('/create', csrfProtection, function (request, response) {

    response.render('createFaq.hbs', { csrfToken: request.csrfToken() })
})

router.get('/:faqID', csrfProtection, function (request, response) {

    const faqID = request.params.faqID

    db.getFaqById(faqID, function (error, FAQ) {

        if (error) {

            const model =
            {
                hasDatabaseError: true,
                FAQ: [],
                csrfToken: request.csrfToken()
            }

            response.redirect('faq.hbs', model)

        } else {

            const model =
            {
                hasDatabaseError: false,
                FAQ,
                csrfToken: request.csrfToken()
            }

            response.render('faq.hbs', model)
        }
    })
})

router.post('/create', csrfProtection, function (request, response) {

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
                    answer,
                    csrfToken: request.csrfToken()
                }

                response.render('createFaq.hbs', model)

            } else {

                response.redirect('/faq')
            }
        })

    } else {

        const model =
        {
            errors,
            question,
            answer,
            csrfToken: request.csrfToken()
        }

        response.render('createFaq.hbs', model)
    }
})
//--------------------/CREATE FAQ-----------------------------------------

//--------------------UPDATE FAQ-----------------------------------------
router.get('/:faqID/update', csrfProtection, function (request, response) {

    const faqID = request.params.faqID

    db.getFaqById(faqID, function (error, FAQ) {

        if (error) {

            const model = 
            {
                hasDatabaseError: true,
                FAQ: [],
                csrfToken: request.csrfToken()
            }

            response.render('updateFaq.hbs', model)

        } else {

            const model =
            {
                hasDatabaseError: false,
                FAQ,
                csrfToken: request.csrfToken()
            }

            response.render('updateFaq.hbs', model)
        }
    })
})

router.post('/:faqID/update', csrfProtection, function (request, response) {

    const faqID = request.params.faqID
    const question = request.body.question
    const answer = request.body.answer

    const errors = validators.getFaqValidationErrors(question, answer)


    if (!request.session.isLoggedIn) {
        errors.push("Not logged in.")
    }

    if (errors.length == 0) {

        db.updateFaqbyId(faqID, question, answer, function (error) {

            if (error) {

                errors.push("Internal server error")

                const model =
                {
                    errors,
                    faqID,
                    question,
                    answer,
                    csrfToken: request.csrfToken()
                }

                response.render('updateFaq.hbs', model)

            } else {

                response.redirect('/faq')
            }
        })

    } else {

        const model =
        {
            errors,
            FAQ: {
                faqID,
                question,
                answer,
                csrfToken: request.csrfToken()
            }
        }

        response.render('updateFaq.hbs', model)
    }
})
//--------------------/UPDATE  FAQ-----------------------------------------

//--------------------DELETE FAQ-----------------------------------------
router.get('/:faqID/delete', csrfProtection, function (request, response) {

    const faqID = request.params.faqID

    db.getFaqById(faqID, function (error, FAQ) {

        if (error) {

            const model =
            {
                hasDatabaseError: true,
                FAQ: [],
                csrfToken: request.csrfToken()
            }
            response.render('deleteFaq.hbs', model)

        } else {

            const model =
            {
                hasDatabaseError: false,
                FAQ,
                csrfToken: request.csrfToken()
            }

            response.render('deleteFaq.hbs', model)
        }
    })
})

router.post('/:faqID/delete', csrfProtection, function (request, response) {

    const faqID = request.params.faqID

    const errors = validators.getFaqIdValidationErrors(faqID)

    if (!request.session.isLoggedIn) {
        errors.push("Not logged in.")
    }

    if (errors.length == 0) {

        db.deleteFaqById(faqID, function (error) {

            if (error) {

                errors.push("Internal server error.")

                const model =
                {
                    errors,
                    faqID,
                    csrfToken: request.csrfToken()
                }
                
                response.render('deleteFaq.hbs', model)

            } else {

                response.redirect('/faq')
            }
        })

    } else {

        const model =
        {
            errors,
            FAQ: {
                faqID,
                csrfToken: request.csrfToken()
            }
        }

        response.render('deleteFaq.hbs', model)
    }
})
//--------------------/DELETE FAQ-----------------------------------------

module.exports = router