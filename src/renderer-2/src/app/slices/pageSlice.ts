import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

export interface PageState {
  type: "home" | "playlist" | "my-albums" | "my-playlists";
  title?: string;
  loading: boolean;
  errors: {
    type: string;
    massage: string;
  }[];
}

const initialState: PageState = {
  type: "home",
  loading: false,
  errors: [],
};

export const pageSlice = createSlice({
  name: "page",
  initialState,
  reducers: {
    setPage: (state, action: PayloadAction<Partial<PageState>>) => {
      return { ...state, ...action.payload };
    },
    goBack: (state) => {
      return { ...initialState };
    },

    loadMyPlaylistsPage(state) {
      state.type = "my-playlists";
      state.title = "My Playlists";
      state.loading = false;
    },

    loadMyAlbumsPage(state) {
      state.type = "my-albums";
      state.title = "My Albums";
      state.loading = false;
    },
  },
});

export const { goBack, setPage, loadMyPlaylistsPage, loadMyAlbumsPage } =
  pageSlice.actions;

export const selectPage = (state: RootState) => state.page;
export const selectPageErrors = (state: RootState) => state.page.errors;

export default pageSlice.reducer;
