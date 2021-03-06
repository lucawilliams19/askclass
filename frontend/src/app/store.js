import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import itemReducer from '../features/items/itemSlice'
import fileReducer from '../features/files/fileSlice'
import emailReducer from '../features/email/emailSlice'
// import analyticsReducer from '../features/analytics/analyticsSlice'

export const store = configureStore({
	reducer: {
		auth: authReducer,
		item: itemReducer,
		file: fileReducer,
		email: emailReducer,
		// analytics: analyticsReducer,
	},
})
