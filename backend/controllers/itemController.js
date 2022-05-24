const asyncHandler = require('express-async-handler')

const Item = require('../models/itemModel')

//@desc Get item
//@route GET /api/items
//@access Private
const getItems = asyncHandler(async (req, res) => {
	//Get only the items that match the id of a user
	const items = await Item.find({ user: req.user.id })

	res.status(200).json(items)
})
//@desc Set item
//@route POST /api/items
//@access Private
const setItem = asyncHandler(async (req, res) => {
	if (!req.body.text) {
		res.status(400)
		throw new Error('Please add a text field')
	}
	const item = await Item.create({
		name: req.body.name,
		email: req.body.email,
		text: req.body.text,
		user: req.user.id,
	})

	res.status(200).json(item)
})

//@desc Update item
//@route PUT /api/items/:id
//@access Private
const updateItem = asyncHandler(async (req, res) => {
	const item = await Item.findById(req.params.id)

	if (!item) {
		res.status(400)
		throw new Error('Item not found')
	}

	// Check for user
	if (!req.user) {
		res.status(401)
		throw new Error('User not found')
	}

	// Make the logged in user matches the item user
	if (item.user.toString() !== req.user.id) {
		res.status(401)
		throw new Error('User not authorized')
	}

	const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true })

	res.status(200).json(updatedItem)
})

//@desc Delete item
//@route DELETE /api/items/:id
//@access Private
const deleteItem = asyncHandler(async (req, res) => {
	const item = await Item.findById(req.params.id)
	if (!item) {
		res.status(400)
		throw new Error('Item not found')
	}

	// Check for user
	if (!req.user) {
		res.status(401)
		throw new Error()
	}

	//Make sure the logged in user mathes the goal user
	if (item.user.toString() !== req.user.id) {
		res.status(401)
		throw new Error('User not authorized')
	}

	await item.remove()

	res.status(200).json({ id: req.params.id })
})
module.exports = {
	getItems,
	setItem,
	updateItem,
	deleteItem,
}
