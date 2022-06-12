const asyncHandler = require( 'express-async-handler' )

const File = require( '../models/fileModel' )

//@desc Get item
//@route GET /api/files
//@access Private
const getFiles = asyncHandler(async (req, res) => {
	//Get only the items that match the id of a user
	const files = await Item.find({ user: req.user.id })

	res.status(200).json(files)
} )

//@desc Set item
//@route POST /api/files
//@access Private
const setFile = asyncHandler( async ( req, res ) => {
	//
		if (!req.body.name) {
			throw new Error('Please add a name field')
		}
		const file = await File.create({
			name: req.body.name,
			type: req.body.type,
			content: req.body.text,
		})

		res.status(200).json(file)
} )

//@desc Get item
//@route GET /api/files
//@access Private
const updateFile = asyncHandler(async (req, res) => {
	const file = await File.findById(req.params.id)

	if (!file) {
		res.status(400)
		throw new Error('File not found')
	}

	// Check for user
	if (!req.user) {
		res.status(401)
		throw new Error('User not found')
	}

	// Make the logged in user matches the item user
	if (file.user.toString() !== req.user.id) {
		res.status(401)
		throw new Error('User not authorized')
	}

	const updatedFile = await File.findByIdAndUpdate(req.params.id, req.body, { new: true })

	res.status(200).json(updateFile)
} )

//@desc Get item
//@route GET /api/files
//@access Private
const deleteFile = asyncHandler(async (req, res) => {
	const file = await File.findById(req.params.id)
	if (!file) {
		res.status(400)
		throw new Error('File not found')
	}

	// Check for user
	if (!req.user) {
		res.status(401)
		throw new Error()
	}

	//Make sure the logged in user mathes the goal user
	if (file.user.toString() !== req.user.id) {
		res.status(401)
		throw new Error('User not authorized')
	}

	await file.remove()

	res.status(200).json({ id: req.params.id })
})



module.exports = {
	getFiles,
	setFile,
	updateFile,
	deleteFile,
}