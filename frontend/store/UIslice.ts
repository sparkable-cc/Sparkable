import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";
import { UITypes, ApiTypes } from "../types";

export interface UIState {
  isMenuVisible: boolean;
  selectedFilters: string[]
  sort: UITypes.Option
  articles: ApiTypes.Model.Link[]
  total: number
}

const initialState: UIState = {
  isMenuVisible: false,
  selectedFilters: [],
  sort: {
    value: "random",
    label: "Random"
  },
  articles: [],
  total: 0
};

export const UISlice = createSlice({
  name: "UI",
  initialState,
  reducers: {
    setMenuVisible: (state, action: PayloadAction<boolean>) => {
      state.isMenuVisible = action.payload;
    },
    setFilter: (state, action: PayloadAction<string>) => {
      if (state.selectedFilters?.find(item => item === action.payload)) {
        state.selectedFilters = state.selectedFilters.filter(item => item !== action.payload);
      } else {
        state.selectedFilters = [...state.selectedFilters, ...[action.payload]]
      }
    },
    resetFilter: (state) => {
      state.selectedFilters = [];
    },
    setSort: (state, action: PayloadAction<UITypes.Option>) => {
      state.sort = action.payload;
    },
    setArticles: (state, action: PayloadAction<ApiTypes.Model.Link[]>) => {
      state.articles = action.payload;
    },
    setTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
  },
});

export const {
  setMenuVisible,
  setFilter,
  resetFilter,
  setSort,
  setArticles,
  setTotal,
} = UISlice.actions;

export const selectIsMenuVisible = (state: RootState) => state.UI.isMenuVisible;
export const selectSelectedFilters = (state: RootState) => state.UI.selectedFilters;
export const selectSort = (state: RootState) => state.UI.sort;
export const selectArticles = (state: RootState) => state.UI.articles;
export const selectTotal = (state: RootState) => state.UI.total;

export default UISlice.reducer;
