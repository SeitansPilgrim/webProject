const express = require('express')

const router = express.Router()

const ADMIN_USERNAME = 's'
const ADMIN_PASSWORD = 's'


router.get('/login', function (request, response) {
    response.render('login.hbs')
})


router.post('/login', function (request, response) {

    const username = request.body.username
    const password = request.body.password

    if (username == ADMIN_USERNAME && password == ADMIN_PASSWORD) {
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