import React from "react";
import { Page } from "../components/Page";
import {
  PlaylistActions,
  PlaylistFooter,
  PlaylistRoot,
  PlaylistTrack,
  TrackActions,
  TrackImage,
  TrackTitle,
} from "../components/Playlist";
import {
  PlayListError,
  PlaylistSkeleton,
} from "../components/PlaylistSkeleton";
import { Scrollbars } from "../components/Scrollbars";
import { useAppDispatch, useAppSelector } from "../hooks";
import { goBack, selectPage } from "../slices/pageSlice";
import {
  selectIsActive,
  selectIsStopping,
  selectTrackById,
  tracksSelectors,
} from "../slices/playlistSlice";

export const PlaylistsScreen = () => {
  const dispatch = useAppDispatch();
  const page = useAppSelector(selectPage);
  const tracksIds = useAppSelector((state) => tracksSelectors.selectIds(state));
  const isAlbum = page.type === "my-albums";

  if (tracksIds.length === 0 || page.loading) {
    return (
      <Page
        title={"Playlist: " + (page.title || "Loading...")}
        goBack={() => {
          dispatch(goBack());
        }}
        fullScreen
      >
        <div className="flex h-full flex-col gap-2">
          <PlaylistActions />
          {page.loading ? <PlaylistSkeleton /> : <PlayListError />}
          <PlaylistFooter />
        </div>
      </Page>
    );
  }

  return (
    <Page
      title={"Playlist: " + (page.title || "Loading...")}
      goBack={() => {
        dispatch(goBack());
      }}
      fullScreen
    >
      <div className="flex h-full flex-col gap-2">
        <PlaylistActions />
        <Scrollbars>
          <PlaylistRoot>
            {tracksIds.map((id: any) => (
              <Track key={id} id={id} />
            ))}
          </PlaylistRoot>
        </Scrollbars>
        <PlaylistFooter />
      </div>
    </Page>
  );
};

const Track = ({ id }: { id: number }) => {
  const track = useAppSelector((state) =>
    tracksSelectors.selectById(state, id)
  )!;

  const dispatch = useAppDispatch();

  const active = useAppSelector(selectIsActive);
  const stopping = useAppSelector(selectIsStopping);

  const selected = track.selected;
  const downloaded = track.state == "downloaded";

  let title = track.selected
    ? `Deselect "${track.title}"`
    : `Select "${track.title}"`;

  if (active || stopping) {
    title = `State: ${track.state}`;
  }

  if (downloaded && track.filePath) {
    title = `Open "${track.title}" in external app`;
  }

  const scrollIntoViewRef = React.useCallback((node: HTMLLIElement) => {
    // console.log("scrollIntoViewRef", { node });
    if (node !== null) {
      node.scrollIntoView &&
        node.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }
  }, []);

  return (
    <PlaylistTrack
      selected={selected}
      downloaded={downloaded}
      title={title}
      onClick={() => {
        if (!(active || downloaded || stopping)) {
          dispatch(selectTrackById(id, !selected));
        } else if (downloaded && track.filePath) {
          window.openExternal(track.filePath);
        }
      }}
      className={`${(active || stopping) && !selected ? "hidden" : ""}`}
      ref={active && track.state == "downloading" ? scrollIntoViewRef : null}
    >
      <TrackImage
        bg={track.hexcolor}
        src={`https://anghamicoverart1.akamaized.net/?id=${track.coverArt}&size=80`}
      />

      <TrackTitle>
        <h4 className="text-sm font-bold text-white text-opacity-80 dark:text-black dark:text-opacity-80">
          {track.title}
        </h4>
        <div className="text-xs text-white text-opacity-60 dark:text-black dark:text-opacity-80">
          <span className="track-artist"> {track.artist} </span>
          {track.year ? (
            <>
              <span>/</span>
              <span className="track-year"> {track.year} </span>
            </>
          ) : null}
        </div>
      </TrackTitle>

      <TrackActions
        id={id}
        active={active}
        stopping={stopping}
        selected={selected}
      />
    </PlaylistTrack>
  );
};
