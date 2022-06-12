import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import emailService from './emailService'

const initialState = {
	emails: [],
	isError: false,
	isLoading: false,
	isSuccess: false,
	message: '',
}

// // Send email action

export const sendEmail = createAsyncThunk('email/send_email', async (emailData, thunkAPI) => {
	// emailData is the payload
	try {
		return await emailService.sendEmail(emailData)
	} catch (error) {
		const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
		return thunkAPI.rejectWithValue(message)
	}
})

export const emailSlice = createSlice({
	name: 'email',
	initialState,
	reducers: {
		reset: (state) => initialState,
	},
	extraReducers: (builder) => {
		builder
			.addCase(sendEmail.pending, (state, action) => {
				
				state.isLoading = true
			})

			.addCase(sendEmail.fulfilled, (state, action) => {
				state.isLoading = false
				state.isSuccess = true

				state.message = action.payload
			})
			.addCase(sendEmail.rejected, (state, action) => {
				state.isLoading = false
				state.isError = true
				state.message = action.payload
			})
	},
})

export const { reset } = emailSlice.actions
export default emailSlice.reducer
