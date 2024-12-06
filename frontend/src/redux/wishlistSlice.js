// frontend/src/redux/wishlistSlice.js
import { createSlice } from "@reduxjs/toolkit";

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        wishlistItems: [], // Initialize as an empty array
    },
    reducers: {
        setWishlist: (state, action) => {
            state.wishlistItems = action.payload; // Set the wishlist items
        },
        addToWishlist: (state, action) => {
            const itemExists = state.wishlistItems.some(item => item.jobId === action.payload.jobId);
            if (!itemExists) {
                state.wishlistItems.push(action.payload); // Add item if it doesn't exist
            }
        },
        removeFromWishlist: (state, action) => {
            state.wishlistItems = state.wishlistItems.filter(item => item.jobId !== action.payload.jobId); // Remove item by jobId
        },
    },
});

export const {
    setWishlist,
    addToWishlist,
    removeFromWishlist,
} = wishlistSlice.actions;

export default wishlistSlice.reducer;
