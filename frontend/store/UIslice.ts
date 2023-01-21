import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";
import { ApiTypes } from "../types";

export interface UIState {
  isMenuVisible: boolean;
  selectedFilters: ApiTypes.Model.CategorySlug[]
}

const initialState: UIState = {
  isMenuVisible: false,
  selectedFilters: []
};

export const UISlice = createSlice({
  name: "UI",
  initialState,
  reducers: {
    setMenuVisible: (state, action: PayloadAction<boolean>) => {
      state.isMenuVisible = action.payload;
    },
    setFilters: (state, action: PayloadAction<ApiTypes.Model.CategorySlug>) => {
      if (state.selectedFilters?.find(item => item === action.payload)) {
        state.selectedFilters = state.selectedFilters.filter(item => item !== action.payload);
      } else {
        state.selectedFilters = [...state.selectedFilters, ...[action.payload]]
      }
    }
  },
});

export const {
  setMenuVisible,
  setFilters,
} = UISlice.actions;

export const selectIsMenuVisible = (state: RootState) => state.UI.isMenuVisible;
export const selectSelectedFilters = (state: RootState) => state.UI.selectedFilters;

export default UISlice.reducer;
