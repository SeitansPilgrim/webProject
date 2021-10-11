express = require('express')

const ADMIN_USERNAME = 's'
const ADMIN_PASSWORD = 's'

const router = express.Router()

router.get('/', function (request, response) {
    response.render('login.hbs')
})


router.post('/', function (request, response) {

    const username = request.params.username
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