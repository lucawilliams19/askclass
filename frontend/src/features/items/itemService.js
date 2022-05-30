import axios from 'axios'

const API_URL = '/api/items/'

// Create new item
const createItem = async (itemData) => {

	const response = await axios.post(API_URL, itemData)
	return response.data
}

// Get user items
const getItems = async () => {
	
	const response = await axios.get(API_URL)

	return response.data
}

// const updatedItem = async (itemData, token) => {
// 	const config = {
// 		headers: {
// 			Authorization: `Bearer ${token}`,
// 		},
// 	}

// 	const response = await axios().get(API_URL, itemData)

// 	return response.data
// }

//Delete use item
const deleteItem = async (itemId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}

	const response = await axios.delete(API_URL + itemId, config)
	return response.data
}

const itemService = {
	createItem,
	getItems,
	// updatedItem,
	deleteItem,
}

export default itemService
