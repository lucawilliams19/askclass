import axios from 'axios'

const API_URL = '/api/files/'

// Create new item
const createFile = async (fileData) => {
	// const config = {
	// 	headers: {
	// 		Authorization: `Bearer ${token}`,
	// 	},
	// }
	const response = await axios.post(API_URL, fileData)
	return response.data
}

// Get user items
const getFiles = async (token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}
	const response = await axios.get(API_URL, config)

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
const deleteFile = async (fileId, token) => {
	const config = {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	}

	const response = await axios.delete(API_URL + fileId, config)
	return response.data
}

const fileService = {
createFile,
	getFiles,
	// updatedItem,
	deleteFile,
}

export default fileService
