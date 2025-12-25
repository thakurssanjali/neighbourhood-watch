import { configureStore } from "@reduxjs/toolkit";
import incidentReducer from "./incidentSlice";

export const store = configureStore({
  reducer: {
    incidents: incidentReducer
  }
});
