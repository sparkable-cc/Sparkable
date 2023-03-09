import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import { articlesApi } from "./api/articlesApi";
import { authApi } from "./api/authApi";
import { trackingApi } from "./api/trackingApi";
import { submissionApi } from "./api/submissionApi";
import UIReducer from "./UIslice";
import submissionReducer from "./submissionSlice";

export const store = configureStore({
  reducer: {
    [articlesApi.reducerPath]: articlesApi.reducer,
    [authApi.reducerPath]: authApi.reducer,
    [submissionApi.reducerPath]: submissionApi.reducer,
    [trackingApi.reducerPath]: trackingApi.reducer,
    UI: UIReducer,
    submission: submissionReducer
  },
  middleware: (getDefaultMiddleware) => {
    return getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(articlesApi.middleware)
      .concat(authApi.middleware)
      .concat(submissionApi.middleware)
      .concat(trackingApi.middleware);
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType,
  RootState,
  unknown,
  Action<string>>;
