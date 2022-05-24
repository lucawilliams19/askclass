import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import fileService from './fileService'

const initialState = {
	items: [],
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
}

// Create new file
// thunk API allows us to get any state from any function including 'auth'
export const createFile = createAsyncThunk('files/create', async (fileData, thunkAPI) => {
	try {
		
		//@desc Attempt createFile
		//@route--TO Method: auth/register File: ./authService TO Method: axios.post File:
		//@access Public
		return await fileService.createFile(fileData)
	} catch (error) {
		const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
		return thunkAPI.rejectWithValue(message)
	}
})

// Get user files
export const getFiles = createAsyncThunk('files/getAll', async (_, thunkAPI) => {
	try {
		const token = thunkAPI.getState().auth.user.token

		return await fileService.getItems(token)
	} catch (error) {
		const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
		return thunkAPI.rejectWithValue(message)
	}
})

// Delete user itme
// thunk API allows us to get any state from any function including 'auth'
export const deleteFile = createAsyncThunk('files/delete', async (id, thunkAPI) => {
	try {
		const token = thunkAPI.getState().auth.user.token
		//@desc Attempt deleteItem
		//@route--TO Method: auth/register File: ./authService TO Method: axios.post File:
		//@access Private
		return await fileService.deleteItem(id, token)
	} catch (error) {
		const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
		return thunkAPI.rejectWithValue(message)
	}
})

// export itemSlice
export const fileSlice = createSlice({
	name: 'file',
	initialState,
	reducers: {
		reset: (state) => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addCase(createFile.pending, (state) => {
				state.isLoading = true
			})
			.addCase(createFile.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				//uses redux toolkit
				//This is not normally allowed but this lib has helpers to do this
				state.items.push(action.payload)
			})
			.addCase(createFile.rejected, (state, action) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload
			})
			.addCase(getFiles.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getFiles.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				//uses redux toolkit
				//This is not normally allowed but this lib has helpers to do this
				state.items = action.payload
			})
			.addCase(getFiles.rejected, (state, action) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload
			})
			.addCase(deleteFile.pending, (state) => {
				state.isLoading = true
			})
			.addCase(deleteFile.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true

				// if action.payload is used UI will show change after refresh
				state.items = state.items.filter((item) => item._id !== action.payload.id)
			})
			.addCase(deleteFile.rejected, (state, action) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload
			})
	},
})

export const { reset } = fileSlice.actions
export default fileSlice.reducer
