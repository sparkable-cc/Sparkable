import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { api } from "./api";
import UIReducer from "./UIslice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    UI: UIReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(api.middleware)
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
  RootState,
  unknown,
  Action<string>>;
