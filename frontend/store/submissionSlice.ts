import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

export interface SubmissionState {
  link: string;
}

const initialState: SubmissionState = {
  link: "",
};

export const submissionState = createSlice({
  name: "submission",
  initialState,
  reducers: {
    setLink: (state, action: PayloadAction<string>) => {
      state.link = action.payload;
    },
  },
});

export const {
  setLink,
} = submissionState.actions;

export const selectLink = (state: RootState) => state.submission.link;

export default submissionState.reducer;
