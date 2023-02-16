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
    setFilters: (state, action: PayloadAction<string[]>) => {
      state.selectedFilters = action.payload
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
  setFilters,
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
