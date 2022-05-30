const mongoose = require('mongoose')

const itemSchema = mongoose.Schema(
	{
	
	
		name: {
			type: String,
		},
		email: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Item', itemSchema)
