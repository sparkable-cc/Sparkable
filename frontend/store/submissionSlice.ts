import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";
import { storageKeys } from "../utils/storageKeys";
import { ApiTypes } from "../types/api"

let storageLink;
let storageLinkData;
let storageCategories;
let storageSuggestedCategory;
let storageYourStatement;

if (typeof window !== 'undefined') {
  storageLink = sessionStorage.getItem(storageKeys.submissionLink);
  storageLinkData = sessionStorage.getItem(storageKeys.submissionLinkData);
  storageCategories = sessionStorage.getItem(storageKeys.submissionCategories);
  storageSuggestedCategory = sessionStorage.getItem(storageKeys.submissionSuggestedCategory);
  storageYourStatement = sessionStorage.getItem(storageKeys.submissionYourStatement);
}

export interface SubmissionState {
  link: string;
  linkData: ApiTypes.Res.SubmissionLinkPreview | null
  categories: ApiTypes.Model.Category[];
  suggestedCategory: string
  yourStatement: string
}

const initialState: SubmissionState = {
  link: storageLink || "",
  linkData: storageLinkData ? JSON.parse(storageLinkData) : null,
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
    setLinkData: (state, action: PayloadAction<ApiTypes.Res.SubmissionLinkPreview | null>) => {
      state.linkData = action.payload;
    },
    setCategories: (state, action: PayloadAction<ApiTypes.Model.Category[]>) => {
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
      state.linkData = null

      sessionStorage.removeItem(storageKeys.submissionLink);
      sessionStorage.removeItem(storageKeys.submissionLinkData);
      sessionStorage.removeItem(storageKeys.submissionCategories);
      sessionStorage.removeItem(storageKeys.submissionSuggestedCategory);
      sessionStorage.removeItem(storageKeys.submissionYourStatement);
    },
  },
});

export const {
  setLink,
  setLinkData,
  setCategories,
  setSuggestedCategory,
  setYourStatement,
  resetSubmission,
} = submissionState.actions;

export const selectLink = (state: RootState) => state.submission.link;
export const selectLinkData = (state: RootState) => state.submission.linkData;
export const selectCategories = (state: RootState) => state.submission.categories;
export const selectSuggestedCategory = (state: RootState) => state.submission.suggestedCategory;
export const selectYourStatement = (state: RootState) => state.submission.yourStatement;

export default submissionState.reducer;
