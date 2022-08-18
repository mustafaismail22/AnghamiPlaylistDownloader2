import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
// import logger from "redux-logger";
import promise from "redux-promise-middleware";
import pageReducer from "./slices/pageSlice";
import playlistReducer from "./slices/playlistSlice";
import profileReducer from "./slices/profileSlice";

export const store = configureStore({
  preloadedState: {
    ...(JSON.parse(localStorage.getItem("store") || "{}") as any),
  },
  reducer: {
    page: pageReducer,
    profile: profileReducer,
    playlist: playlistReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(promise),
});

window["store"] = store;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
