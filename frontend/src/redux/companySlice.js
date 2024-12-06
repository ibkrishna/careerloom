import { createSlice } from "@reduxjs/toolkit";

const companySlice = createSlice({
    name:"company",
    initialState:{
        singleCompany:null,
        companies:[],
        searchCompanyByText:"",
        loading: false,
        error: null,   
    },
    reducers: {
        // actions
        setSingleCompany: (state, action) => {
            state.singleCompany = action.payload;
            state.error = null; // Clear error when setting single company
        },
        setCompanies: (state, action) => {
            state.companies = action.payload;
            state.error = null; // Clear error when setting companies
        },
        setSearchCompanyByText: (state, action) => {
            state.searchCompanyByText = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload; // Set loading state
        },
        setError: (state, action) => {
            state.error = action.payload; // Set error state
        },
        clearError: (state) => {
            state.error = null; // Clear error state
        },
    },
});
export const {setSingleCompany, setCompanies,setSearchCompanyByText,
    setLoading,
    setError,
    clearError,} = companySlice.actions;
export default companySlice.reducer;