import { createSlice } from "@reduxjs/toolkit";

const incidentSlice = createSlice({
  name: "incidents",
  initialState: {
    list: [],
    loading: false,
    error: null
  },
  reducers: {
    setIncidents: (state, action) => {
      state.list = action.payload;
    },
    addIncident: (state, action) => {
      state.list.push(action.payload);
    },
    updateIncident: (state, action) => {
      const index = state.list.findIndex((i) => i._id === action.payload._id);
      if (index !== -1) state.list[index] = action.payload;
    },
    deleteIncident: (state, action) => {
      state.list = state.list.filter((i) => i._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const { setIncidents, addIncident, updateIncident, deleteIncident, setLoading, setError } =
  incidentSlice.actions;

export default incidentSlice.reducer;
