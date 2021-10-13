const express = require('express')
const bcrypt = require('bcryptjs')
const csurf = require('csurf')

const csrfProtection = csurf()
const router = express.Router()


const ADMIN_USERNAME = 's'
const ADMIN_PASSWORD = 's'
const HASH_PASSWORD = bcrypt.hashSync(ADMIN_PASSWORD, 8)

console.log(HASH_PASSWORD)

router.get('/login',csrfProtection, function (request, response) {
    response.render('login.hbs', { csrfToken: request.csrfToken() })
})


router.post('/login', csrfProtection, function (request, response) {

    const username = request.body.username
    const password = request.body.password

    if (username == ADMIN_USERNAME && bcrypt.compare(password, HASH_PASSWORD)) {
        request.session.isLoggedIn = true
        // TODO: Do something better than redirecting to start page.
        response.redirect('/')
    }

    else {
        // TODO: Display error message to the user.
        response.render('login.hbs')
    }
})

module.exports = router