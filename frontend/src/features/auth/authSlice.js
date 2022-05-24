import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

//import methods that connect to the API
import authService from './authService'
//Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'))

//Initialize state
const initialState = {
	user: user ? user : null,
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
}

//Register user
export const register = createAsyncThunk('auth/register', async (user, thunkAPI) => {
	try {
		//@desc Attempt user register
		//@route--TO Method: auth/register File: ./authService TO Method: axios.post File:
		//@access Public
		return await authService.register(user)
	} catch (error) {
		const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
		return thunkAPI.rejectWithValue(message)
	}
})

//Login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
	try {
		//@desc Set the local user based on email
		//@route--to
		//@access Public
		return await authService.login(user)
	} catch (error) {
		const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
		return thunkAPI.rejectWithValue(message)
	}
})

//Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
	//@desc Set the local user to none
	//@route--TO localStorage/setItem
	//@access Public
	await authService.logout()
})

export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		reset: (state) => {
			state.isLoading = false
			state.isSuccess = false
			state.isError = false
			state.message = ''
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(register.pending, (state) => {
				// Set isLoading to true
				state.isLoading = true
			})
			.addCase(register.fulfilled, (state, action) => {
				// Set isLoading to false
				state.isLoading = false
				// Set isSuccess to true
				state.isSuccess = true
				// Response from backend
				// action.payload is user information
				state.user = action.payload
			})
			.addCase(register.rejected, (state, action) => {
				// Set isLoading to false
				state.isLoading = false
				// Set isError to true
				state.isError = true
				// Response from backend
				// action.payload is error message
				state.message = action.payload
				// user is set to none
				state.user = null
			})
			.addCase(logout.fulfilled, (state, action) => {
				// Response from backend
				// action.payload is user from db according to email
				state.user = action.payload
			})

			.addCase(login.pending, (state) => {
				// Set is Loading to true
				state.isLoading = true
			})

			.addCase(login.fulfilled, (state, action) => {
				// Set isLoading to false
				state.isLoading = false
				// Set isSuccess to true
				state.isSuccess = true
				// Response from backend
				// action.payload is user from db according to email
				state.user = action.payload
			})

			.addCase(login.rejected, (state, action) => {
				// Set isLoading to false
				state.isLoading = false
				// Set isError to true
				state.isError = true
				// Response from backend
				// action.payload is error message
				state.message = action.payload
				// Set user to none
				state.user = null
			})
	},
})

export const { reset } = authSlice.actions
export default authSlice.reducer
