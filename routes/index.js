const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

// @desc Login/Langing page
// @route GET /
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: "login",
    })
})

//@desc Dashboard
//@Route GET / dashboard
router.get('/dashboard', ensureAuth, (req, res) => {
    console.log(req.user)
    res.render('dashboard')
})


module.exports = router