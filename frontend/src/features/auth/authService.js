import axios from 'axios'

const API_URL = '/api/users/'

// Register user
// A asnyc function called register
// Takes in the userData from the register form
const register = async (userData) => {
	//@desc Create response constant and make it the response of attempted registration of new user
	//@route POST /api/users/
	//@access Public
	const response = await axios.post(API_URL, userData)

	//@desc Set the new user as the logged in user
	//@route--TO localStorage/setItem
	//@access Public
	if (response.data) {
		localStorage.setItem('user', JSON.stringify(response.data))
	}

	return response.data
}

// Login user
//A function called login
//Params: take in userData that we get from the form
const login = async (userData) => {
	//create a constant for the response
	//Make the response go to the api url and concat 'login to url'
	//Pass in the user data as well
	const response = await axios.post(API_URL + 'login', userData)

	// If the response data exists and is true
	if (response.data) {
		localStorage.setItem('user', JSON.stringify(response.data))
	}
	return response.data
}

//Logout user
const logout = () => {
	//@desc Set the local user to none
	//@route--TO localStorage/setItem
	//@access Public
	localStorage.removeItem('user')
}

const authService = {
	register,
	logout,
	login,
}

export default authService
