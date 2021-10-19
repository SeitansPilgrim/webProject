const express = require('express')
const bcrypt = require('bcryptjs')
const csurf = require('csurf')

const csrfProtection = csurf()
const router = express.Router()


const ADMIN_USERNAME = 's'
const ADMIN_PASSWORD = 's'
const HASH_PASSWORD = bcrypt.hashSync(ADMIN_PASSWORD, 8)

router.get('/login', csrfProtection, function (request, response) {

    response.render('login.hbs', { csrfToken: request.csrfToken() })
})


router.post('/login', csrfProtection, function (request, response) {

    const username = request.body.username
    const password = request.body.password
    const errors = []

    if (username == ADMIN_USERNAME && bcrypt.compare(password, HASH_PASSWORD)) {

        request.session.isLoggedIn = true

        response.redirect('/')

    } else {

        errors.push("Incorrect username or password")

        const model =
        {
            errors,
            csrfToken: request.csrfToken()
        }

        response.render('login.hbs', model)
    }
})

module.exports = router