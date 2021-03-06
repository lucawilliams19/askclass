import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import itemService from './itemService'

const initialState = {
	items: [],
	isError: false,
	isSuccess: false,
	isLoading: false,
	message: '',
}

// Create new item
// thunk API allows us to get any state from any function including 'auth'
export const createItem = createAsyncThunk('items/create', async (itemData, thunkAPI) => {
	try {
		//@desc Attempt createItem
		//@route--TO Method: auth/register File: ./authService TO Method: axios.post File:
		//@access Public
		return await itemService.createItem(itemData)
	} catch (error) {
		const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
		return thunkAPI.rejectWithValue(message)
	}
})

// Get user items
export const getItems = createAsyncThunk('items/getAll', async (_, thunkAPI) => {
	try {
		return await itemService.getItems()
	} catch (error) {
		const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
		return thunkAPI.rejectWithValue(message)
	}
})

// Delete user itme
// thunk API allows us to get any state from any function including 'auth'
export const deleteItem = createAsyncThunk('items/delete', async (id, thunkAPI) => {
	try {
		const token = thunkAPI.getState().auth.user.token
		//@desc Attempt createItem
		//@route--TO Method: auth/register File: ./authService TO Method: axios.post File:
		//@access Private
		return await itemService.deleteItem(id, token)
	} catch (error) {
		const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
		return thunkAPI.rejectWithValue(message)
	}
})

// export itemSlice
export const itemSlice = createSlice({
	name: 'item',
	initialState,
	reducers: {
		reset: (state) => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addCase(createItem.pending, (state) => {
				state.isLoading = true
			})
			.addCase(createItem.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				//uses redux toolkit
				//This is not normally allowed but this lib has helpers to do this
				state.items.push(action.payload)
			})
			.addCase(createItem.rejected, (state, action) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload
			})
			.addCase(getItems.pending, (state) => {
				state.isLoading = true
			})
			.addCase(getItems.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true
				//uses redux toolkit
				//This is not normally allowed but this lib has helpers to do this
				state.items = action.payload
			})
			.addCase(getItems.rejected, (state, action) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload
			})
			.addCase(deleteItem.pending, (state) => {
				state.isLoading = true
			})
			.addCase(deleteItem.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true

				// if action.payload is used UI will show change after refresh
				state.items = state.items.filter((item) => item._id !== action.payload.id)
			})
			.addCase(deleteItem.rejected, (state, action) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload
			})
	},
})

export const { reset } = itemSlice.actions
export default itemSlice.reducer
