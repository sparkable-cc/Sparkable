import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

export interface SubmissionState {
  link: string;
  categories: string[];
  suggestedCategory: string
}

const initialState: SubmissionState = {
  link: "",
  categories: [],
  suggestedCategory: "",
};

export const submissionState = createSlice({
  name: "submission",
  initialState,
  reducers: {
    setLink: (state, action: PayloadAction<string>) => {
      state.link = action.payload;
    },
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    setSuggestedCategory: (state, action: PayloadAction<string>) => {
      state.suggestedCategory = action.payload;
    },
  },
});

export const {
  setLink,
  setCategories,
  setSuggestedCategory,
} = submissionState.actions;

export const selectLink = (state: RootState) => state.submission.link;
export const selectCategories = (state: RootState) => state.submission.categories;
export const selectSuggestedCategory = (state: RootState) => state.submission.suggestedCategory;

export default submissionState.reducer;
