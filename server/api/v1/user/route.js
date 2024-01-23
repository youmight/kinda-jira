const express = require('express')
const router = express.Router()
const {signUp, login, verifyOtp} = require('./controller')

router.post('/signup', signUp)
router.post('/login', login)
router.post('/verifyOtp', verifyOtp)

module.exports = router