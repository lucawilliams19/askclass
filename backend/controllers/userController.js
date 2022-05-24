const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/userModel')

//@desc Register new user
//@route POST /api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
	//@desc Pull in data from form
	//@route-from ./pages/Register
	//@access Public
	const { name, email, password } = req.body

	//@desc Function to check if Register Form is filled out correctly
	//@route-from ./pages/Register
	//@access Public
	if (!name || !email || !password) {
		res.status(400)
		throw new Error('Please add all fields')
	}

	//@desc Pull in data from db
	//@route-to GET /api/users
	//@access Public
	const userExists = await User.findOne({ email })
	if (userExists) {
		res.status(400)
		throw new Error('User already exists')
	}

	// Hash password
	//@desc create a salted password
	//@route-from bcrypt/geSalt
	//@access Public
	const salt = await bcrypt.genSalt(10)

	//@desc has salted passcord
	//@route-from bcrypt/hash
	//@access Public
	const hashedPassword = await bcrypt.hash(password, salt)

	//Create user
	const user = await User.create({
		name,
		email,
		password: hashedPassword,
	})

	//@desc If user is created => add a JWT to user and push user to db
	//@route-to POST /api/users
	//@access Public
	if (user) {
		res.status(201).json({
			_id: user.id,
			name: user.name,
			email: user.email,
			token: generateToken(user.id),
		})
	} else {
		res.status(400)
		throw new Error('Invalid user data')
	}

	res.json({ message: 'Register User' })
})

//@desc Autheiticate user
//@route POST /api/users/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
	//@desc pull data from form
	//@route-from ./pages/Login
	//@access Public
	const { email, password } = req.body

	//Check for user email
	//@desc Check if email exists in db
	//@route-from /api/users
	//@access Public
	const user = await User.findOne({ email })

	//@desc if user exists & password is correct => send confirmation
	//@route-to api/users/login
	//@access Public
	if (user && (await bcrypt.compare(password, user.password))) {
		res.json({
			_id: user.id,
			name: user.name,
			email: user.email,
			token: generateToken(user.id),
		})
	} else {
		res.status(400)
		throw new Error('Invalid credentials')
	}
})

//@desc Get user data
//@route Get /api/users/data
//@access Private
const getUserData = asyncHandler(async (req, res) => {
	// Check if user is authenticaed and pull in items for user
	//@desc pull data
	//@route-from /api/users/login
	//@access Public
	res.status(200).json(req.user)
})

//@desc Delete user data
//@route Delete /api/users/data
//@access Private
const deleteUser = asyncHandler(async (req, res) => {
	res.json({ message: 'Delete user' })
})

//Generate JWT
const generateToken = (id) => {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	})
}

module.exports = { registerUser, loginUser, getUserData, deleteUser }
