import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchIncidents = createAsyncThunk(
  "incidents/fetchIncidents",
  async () => {
    const res = await axios.get("http://localhost:5000/api/incidents");
    return res.data;
  }
);

const incidentSlice = createSlice({
  name: "incidents",
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIncidents.fulfilled, (state, action) => {
      return action.payload;
    });
  }
});

export default incidentSlice.reducer;
