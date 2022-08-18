import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  TPlaylist,
  TSection,
  TSectionAlbum,
  TSectionPlaylist,
} from "anghami-bot/src/types";
import { merge } from "lodash";
import { AppThunk, RootState } from "../store";
import { setCssVariables, setThemeMode } from "../utils";
import { goBack } from "./pageSlice";
import { playlistActions } from "./playlistSlice";

interface ProfilePlaylist extends TSection {
  data: TSectionPlaylist[];
}

interface ProfileAlbums extends TSection {
  data: TSectionAlbum[];
}

export interface ProfilePlaylists {
  likes: TPlaylist;
  playlist: ProfilePlaylist[];
  albums: ProfileAlbums[];
}

export interface ProfileState {
  loggedIn: boolean;
  lastCheck: number;
  status: "idle" | "loading" | "failed";
  settings: {
    convert: boolean;
    themeMode: "light" | "dark";
  };
  playlists: ProfilePlaylists | null;
}

export const login = createAsyncThunk<any, boolean | undefined>(
  "profile/login",
  (check = false, thunkAPI) => {
    return window[check ? "checkLogin" : "loginByUser"]();
  }
);

const initialState: ProfileState = {
  lastCheck: Date.now(),
  loggedIn: false,
  status: "idle",
  settings: {
    convert: false,
    themeMode: "dark",
  },
  playlists: null,
};

export const profileSlice = createSlice({
  name: "profile",
  initialState: merge(
    {},
    initialState,
    JSON.parse(localStorage.getItem("profile") || "{}"),
    {
      settings: {
        themeMode: JSON.parse(
          localStorage.getItem("theme") ||
            `"${initialState.settings.themeMode}"`
        ),
      },
    }
  ) as ProfileState,
  reducers: {
    reset(state) {
      return { ...initialState };
    },
    toggleConvert(state) {
      state.settings.convert = !state.settings.convert;
    },
    setLightMode(
      state,
      action: PayloadAction<ProfileState["settings"]["themeMode"]>
    ) {
      state.settings.themeMode = action.payload;
    },
  },
  extraReducers(builder) {
    builder.addCase(login.pending, (state, action) => {
      state.status = "loading";
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.status = "idle";
      state.loggedIn = !!action.payload;
      state.playlists = !!action.payload ? action.payload : null;
      state.lastCheck = Date.now();
      localStorage.setItem("profile", JSON.stringify(state));
    });
    builder.addCase(login.rejected, (state, action) => {
      state.status = "failed";
    });
  },
});

// Actions
export const profileActions = profileSlice.actions;

export const logOut = (): AppThunk => (dispatch, getState) => {
  console.log("logout");
  localStorage.removeItem("profile");
  dispatch(goBack());
  dispatch(playlistActions.reset());
  dispatch(profileActions.reset());
};

export const toggleLightMode = (): AppThunk => (dispatch, getState) => {
  let themeMode = selectSettings(getState()).themeMode;
  let nextMode: typeof themeMode = themeMode === "light" ? "dark" : "light";

  localStorage.setItem("theme", JSON.stringify(nextMode));
  setThemeMode(nextMode);
  setCssVariables();

  dispatch(profileActions.setLightMode(nextMode));
};

// Selectors
export const selectProfile = (state: RootState) => state.profile;
export const selectProfileStatus = (state: RootState) => state.profile.status;
export const selectProfileLoggedIn = (state: RootState) =>
  state.profile.loggedIn;
export const selectSettings = (state: RootState) => state.profile.settings;
export const selectMyPlaylist = (state: RootState) =>
  state.profile.playlists?.playlist;
export const selectMyAlbums = (state: RootState) =>
  state.profile.playlists?.albums;

export default profileSlice.reducer;
