// Import express for router connection to server
const express = require('express')

// Create a router
const router = express.Router()

// Import all functions from the controller for user
const { registerUser, loginUser, getUserData, deleteUser } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')

router

//@desc Register new user
//@route POST /api/users
//@access Public
router.post('/', registerUser)

//@desc Autheiticate user
//@route POST /api/users/login
//@access Public
router.post('/login', loginUser)

//@desc Get user data
//@route Get /api/users/data
//@access Private
router.get('/me', protect, getUserData)

// Router connection to API/users
router.delete('/deleteUser', deleteUser)

module.exports = router
