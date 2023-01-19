import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { articles } from "./api/articles";
import UIReducer from "./UIslice";

export const store = configureStore({
  reducer: {
    [articles.reducerPath]: articles.reducer,
    UI: UIReducer,
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(articles.middleware)
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
  RootState,
  unknown,
  Action<string>>;
