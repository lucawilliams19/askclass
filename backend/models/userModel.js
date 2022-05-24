const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please add a name'],
		},
		email: {
			type: String,
			required: [true, 'Please add a email'],
			unique: [true, 'Looks like a user with that email already exists'],
		},
		password: {
			type: String,
			required: [true, 'Please add a password'],
		},
		userType: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('User', userSchema)
