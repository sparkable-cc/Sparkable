import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";
import { storageKeys } from "../utils/storageKeys";

let storageLink;
let storageCategories;
let storageSuggestedCategory;
let storageYourStatement;

console.log("window outside", typeof window)

if (typeof window !== 'undefined') {
  console.log("window inside", typeof window)
  storageLink = sessionStorage.getItem(storageKeys.submissionLink);
  storageCategories = sessionStorage.getItem(storageKeys.submissionCategories);
  storageSuggestedCategory = sessionStorage.getItem(storageKeys.submissionSuggestedCategory);
  storageYourStatement = sessionStorage.getItem(storageKeys.submissionYourStatement);
}

export interface SubmissionState {
  link: string;
  categories: string[];
  suggestedCategory: string
  yourStatement: string
}

const initialState: SubmissionState = {
  link: storageLink || "",
  categories: storageCategories ? JSON.parse(storageCategories) : [],
  suggestedCategory: storageSuggestedCategory || "",
  yourStatement: storageYourStatement || ""
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
    setYourStatement: (state, action: PayloadAction<string>) => {
      state.yourStatement = action.payload;
    },
    resetSubmission: (state) => {
      state.link = "";
      state.categories = [];
      state.suggestedCategory = "";
      state.yourStatement = "";
    },
  },
});

export const {
  setLink,
  setCategories,
  setSuggestedCategory,
  setYourStatement,
  resetSubmission,
} = submissionState.actions;

export const selectLink = (state: RootState) => state.submission.link;
export const selectCategories = (state: RootState) => state.submission.categories;
export const selectSuggestedCategory = (state: RootState) => state.submission.suggestedCategory;
export const selectYourStatement = (state: RootState) => state.submission.yourStatement;

export default submissionState.reducer;
