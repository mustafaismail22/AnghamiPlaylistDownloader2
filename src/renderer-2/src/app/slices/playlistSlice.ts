import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { TTrack } from "anghami-bot/src/types";
import { chunk, omit } from "lodash";
import { AppThunk, RootState } from "../store";
import { PageState, setPage } from "./pageSlice";
import { selectSettings } from "./profileSlice";

export interface Track extends TTrack {
  filePath: string;
  state: "downloaded" | "error" | "waiting" | "downloading" | null;
  selected: boolean;
  progress?: {
    percent: number;
    type: string;
  };
}

export interface PlaylistState {
  coverArt: string | null;
  id: string | null;
  title: string | null;
  active: boolean;
}

const tracksAdapter = createEntityAdapter<Track>({
  selectId: (track) => track.id,
  sortComparer: (a, b) => a.title.localeCompare(b.title),
});

const initialState = tracksAdapter.getInitialState({} as PlaylistState);

export const playlistSlice = createSlice({
  name: "playlist",
  initialState,
  reducers: {
    add: tracksAdapter.upsertOne,
    addMany: tracksAdapter.upsertMany,
    update: tracksAdapter.updateOne,
    updateMany: tracksAdapter.updateMany,
    remove: tracksAdapter.removeOne,
    removeAll: tracksAdapter.removeAll,
    reset: (state) => {
      tracksAdapter.setAll(state, []);
      state.active = false;
      state.coverArt = null;
      state.id = null;
      state.title = null;
    },
    setPlaylist: (state, action: PayloadAction<Partial<PlaylistState>>) => {
      return Object.assign({}, state, action.payload);
    },
  },
});

export const playlistActions = playlistSlice.actions;

export const selectTrackById =
  (id: string, selected: boolean = true): AppThunk =>
  (dispatch) => {
    dispatch(
      playlistActions.update({
        id,
        changes: {
          selected,
        },
      })
    );
  };

export const selectAllTracks =
  (value: boolean = true): AppThunk =>
  (dispatch, getState) => {
    const state = getState();
    const tracks = tracksSelectors.selectAll(state);

    return dispatch(
      playlistActions.updateMany(
        tracks
          .filter(({ state }) => state !== "downloaded")
          .filter(({ selected }) => selected != value)
          .map(({ id }) => ({
            id,
            changes: {
              selected: value,
            },
          }))
      )
    );
  };

export const loadPlaylist =
  (url: string, title?: string): AppThunk =>
  async (dispatch, getState) => {
    const state = getState();
    const errors: PageState["errors"] = [];

    try {
      if (!state.profile.loggedIn) {
        errors.push({
          type: "login",
          massage: "Please login to Anghami first",
        });

        throw new Error();
      }

      if (!url || !url.includes("anghami")) {
        errors.push({
          type: "form.url",
          massage: "Please enter a valid URL",
        });

        throw new Error();
      }

      dispatch(playlistActions.reset());

      dispatch(
        setPage({
          type: "playlist",
          title,
          loading: true,
          errors: [],
        })
      );

      const playlist = await window.getTracksDetails(url);

      console.log({ playlist });

      if (!playlist) {
        throw new Error();
      }

      dispatch(
        playlistActions.setPlaylist({
          coverArt: playlist.coverArt,
          id: playlist.id,
          title: playlist.title,
          active: false,
        })
      );

      dispatch(playlistActions.addMany(Object.values(playlist.tracks)));

      return dispatch(
        setPage({
          loading: false,
          type: "playlist",
          title: playlist.title,
          errors: [],
        })
      );
    } catch (error) {
      console.error(error);

      if (!errors.length) {
        errors.push({
          type: "load-playlist",
          massage: "Error loading playlist",
        });
      }

      return dispatch(
        setPage({
          loading: false,
          errors,
        })
      );
    }
  };

export const loadMyLikesPlaylist = (): AppThunk => (dispatch, getState) => {
  dispatch(
    loadPlaylist(
      `'https://play.anghami.com/playlist/${
        getState().profile.playlists?.likes.id || ""
      }'`,
      "My Likes"
    )
  );
};

export const downloadTrack =
  (id: string): AppThunk =>
  (dispatch, getState) => {
    const state = getState();
    const playlist = state.playlist!;
    const convert = selectSettings(state).convert;
    const track = tracksSelectors.selectById(state, id)!;

    dispatch(
      playlistActions.update({
        id,
        changes: {
          state: "downloading",
        },
      })
    );

    return window
      .downloadTrack(track, playlist.title || "", convert)
      .then((result: null | typeof track) => {
        if (!result) {
          throw new Error();
        }

        dispatch(
          playlistActions.update({
            id,
            changes: omit(result, ["sections", "buttons"]),
          })
        );
      })
      .catch((error) => {
        console.error(error);
        dispatch(
          playlistActions.update({
            id,
            changes: {
              state: "error",
            },
          })
        );
      });
  };

window["downloadTrack2"] = downloadTrack;

export const downloadProgress =
  (
    id: string,
    { progress, type }: { progress: number; type: string }
  ): AppThunk =>
  (dispatch, getState) => {
    dispatch(
      playlistActions.update({
        id,
        changes: {
          progress: {
            percent: progress,
            type,
          },
        },
      })
    );
  };

export const downloadPlaylist = (): AppThunk => async (dispatch, getState) => {
  const state = getState();
  const playlist = state.playlist;
  const tracks = selectSelectedTracks(state);

  if (!playlist.id || !tracks.length) {
    return;
  }

  dispatch(
    playlistActions.setPlaylist({
      active: true,
    })
  );

  // window.setProgressBar(0, { mode: "indeterminate" });

  dispatch(
    playlistActions.updateMany(
      tracks.map(({ id }) => ({
        id,
        changes: {
          state: "waiting",
        },
      }))
    )
  );

  const tracksChunk = chunk(tracks, 2);
  for (const trackChunk of tracksChunk) {
    const state = getState();
    const active = selectIsActive(state);

    if (!active) {
      dispatch(
        playlistActions.updateMany(
          tracksSelectors
            .selectAll(state)
            .filter(({ state }) => state == "waiting")
            .map(({ id }) => ({
              id,
              changes: {
                state: null,
              },
            }))
        )
      );

      break;
    }

    await Promise.all(
      trackChunk.map(async (_track) => {
        console.log("downloading", { _track });
        await dispatch(downloadTrack(_track.id));
      })
    );
  }

  dispatch(
    playlistActions.setPlaylist({
      active: false,
    })
  );

  dispatch(
    playlistActions.updateMany(
      tracksSelectors.selectIds(state).map((id) => ({
        id,
        changes: {
          selected: false,
        },
      }))
    )
  );
};

export const stopDownloadingPlaylist = (): AppThunk => (dispatch, getState) => {
  return dispatch(
    playlistActions.setPlaylist({
      active: false,
    })
  );
};

export const tracksSelectors = tracksAdapter.getSelectors(
  (state: RootState) => state.playlist
);

export const selectSelectedTracks = (state: RootState) =>
  tracksSelectors.selectAll(state).filter(({ selected }) => selected);

export const selectSelectedTracksCount = (state: RootState) =>
  selectSelectedTracks(state).length;

export const selectDownloadCount = (state: RootState) =>
  selectSelectedTracks(state).filter(
    ({ state }) => state == "downloaded" || state == "error"
  ).length;

export const selectIsActive = (state: RootState) => !!state.playlist.active;
export const selectIsStopping = (state: RootState) => {
  return (
    tracksSelectors
      .selectAll(state)
      .some(({ state }) => state == "waiting" || state == "downloading") &&
    !selectIsActive(state)
  );
};

export default playlistSlice.reducer;
