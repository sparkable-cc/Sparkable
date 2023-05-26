import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";
import { UITypes, ApiTypes } from "../types";
import { storageKeys } from "../utils/storageKeys";

let userName;
let availableVotingStage;

if (typeof window !== 'undefined') {
  userName = sessionStorage.getItem(storageKeys.userName);
  availableVotingStage = sessionStorage.getItem(storageKeys.availableVotingStage);
}

export interface UIState {
  isMenuVisible: boolean;
  selectedFilters: string[]
  sort: UITypes.SortOption
  articles: ApiTypes.Model.Link[]
  total: number,
  userName: string,
  availableVotingStage: number,
  selectedVotingStage: number | undefined
  isVotingBannerVisible: boolean
}

const initialState: UIState = {
  isMenuVisible: false,
  selectedFilters: [],
  sort: {
    value: "random",
    label: "Random"
  },
  articles: [],
  total: 0,
  availableVotingStage: availableVotingStage && Number(availableVotingStage) || undefined,
  selectedVotingStage: undefined,
  userName: userName || "",
  isVotingBannerVisible: false
};

export const UISlice = createSlice({
  name: "UI",
  initialState,
  reducers: {
    setMenuVisible: (state, action: PayloadAction<boolean>) => {
      state.isMenuVisible = action.payload;
    },
    setFilters: (state, action: PayloadAction<string[]>) => {
      state.selectedFilters = action.payload
    },
    setSort: (state, action: PayloadAction<UITypes.SortOption>) => {
      state.sort = action.payload;
    },
    setArticles: (state, action: PayloadAction<ApiTypes.Model.Link[]>) => {
      state.articles = action.payload;
    },
    setTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    setUserName: (state, action: PayloadAction<string>) => {
      state.userName = action.payload;
    },
    setAvailableVotingStage: (state, action: PayloadAction<number>) => {
      state.availableVotingStage = action.payload;
    },
    setVotingStage: (state, action: PayloadAction<number | undefined>) => {
      state.selectedVotingStage = action.payload;
    },
    setVotingBannerVisible: (state, action: PayloadAction<boolean>) => {
      state.isVotingBannerVisible = action.payload;
    },
  },
});

export const {
  setMenuVisible,
  setFilters,
  setSort,
  setArticles,
  setTotal,
  setUserName,
  setAvailableVotingStage,
  setVotingBannerVisible,
  setVotingStage,
} = UISlice.actions;

export const selectIsMenuVisible = (state: RootState) => state.UI.isMenuVisible;
export const selectSelectedFilters = (state: RootState) => state.UI.selectedFilters;
export const selectSort = (state: RootState) => state.UI.sort;
export const selectArticles = (state: RootState) => state.UI.articles;
export const selectTotal = (state: RootState) => state.UI.total;
export const selectUserName = (state: RootState) => state.UI.userName;
export const selectAvailableVotingStage = (state: RootState) => state.UI.availableVotingStage;
export const selectSelectedVotingStage = (state: RootState) => state.UI.selectedVotingStage;
export const selectIsVotingBannerVisible = (state: RootState) => state.UI.isVotingBannerVisible;

export default UISlice.reducer;
