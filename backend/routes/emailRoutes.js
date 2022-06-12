const express = require('express')
const cors = require('cors')
const router = express.Router()
const { sendEmail } = require('../controllers/emailController')

router.route('/').post(sendEmail)


module.exports = router
