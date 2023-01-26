import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "./index";

export interface UIState {
  isMenuVisible: boolean;
  selectedFilters: string[]
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
    setFilter: (state, action: PayloadAction<string>) => {
      if (state.selectedFilters?.find(item => item === action.payload)) {
        state.selectedFilters = state.selectedFilters.filter(item => item !== action.payload);
      } else {
        state.selectedFilters = [...state.selectedFilters, ...[action.payload]]
      }
    },
    resetFilter: (state, action: PayloadAction<void>) => {
      state.selectedFilters = [];
    }
  },
});

export const {
  setMenuVisible,
  setFilter,
  resetFilter,
} = UISlice.actions;

export const selectIsMenuVisible = (state: RootState) => state.UI.isMenuVisible;
export const selectSelectedFilters = (state: RootState) => state.UI.selectedFilters;

export default UISlice.reducer;
