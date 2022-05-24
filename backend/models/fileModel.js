const mongoose = require( 'mongoose' )

const fileSchema = mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
 },
 name: {
  type: String,
  required: true
 },
	type: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
})

module.exports = mongoose.model('File', fileSchema)