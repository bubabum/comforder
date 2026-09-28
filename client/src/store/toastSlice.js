import { createSlice, nanoid } from '@reduxjs/toolkit';

const toastSlice = createSlice({
	name: 'toast',
	initialState: [],
	reducers: {
		addToast: {
			reducer: (state, action) => {
				state.push(action.payload);
			},
			prepare: ({ message, type = 'info' }) => ({
				payload: { id: nanoid(), message, type },
			}),
		},
		removeToast: (state, action) => {
			return state.filter((t) => t.id !== action.payload);
		},
	},
});

export const { addToast, removeToast } = toastSlice.actions;
export default toastSlice.reducer;