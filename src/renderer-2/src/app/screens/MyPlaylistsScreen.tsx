import React from "react";
import { Page } from "../components/Page";
import {
  PlaylistRoot,
  PlaylistTrack,
  TrackImage,
  TrackTitle,
} from "../components/Playlist";
import { Scrollbars } from "../components/Scrollbars";
import { useAppDispatch, useAppSelector } from "../hooks";
import { goBack, selectPage } from "../slices/pageSlice";
import { loadPlaylist } from "../slices/playlistSlice";
import {
  ProfilePlaylists,
  selectMyAlbums,
  selectMyPlaylist,
} from "../slices/profileSlice";

export const MyPlaylistsScreen = () => {
  const dispatch = useAppDispatch();
  const page = useAppSelector(selectPage);
  const isAlbum = page.type === "my-albums";

  let playlist;

  if (isAlbum) {
    playlist = useAppSelector(selectMyAlbums);
  } else {
    playlist = useAppSelector(selectMyPlaylist);
  }

  const myPlaylists =
    playlist?.reduce((list, p) => {
      return [...list, ...(p.data || [])];
    }, [] as ProfilePlaylists["playlist" | "albums"][number]["data"]) || [];

  console.log({ myPlaylists });

  return (
    <Page
      title={page.title || "My Playlists"}
      goBack={() => {
        dispatch(goBack());
      }}
      fullScreen
    >
      <Scrollbars>
        <PlaylistRoot>
          {myPlaylists.map((playlist, i) => {
            const coverArt = playlist.coverArt.toString().includes("http")
              ? playlist.coverArt
              : `https://anghamicoverart1.akamaized.net/?id=${playlist.coverArt}&size=80`;

            const title = (playlist.name || playlist.title)
              .replace("$1234567890DOWNLOADED#", "My Downloads")
              .replace("$1234567890LIKED#", "My Likes")
              .replace("$1234567890PODCASTS#", "My Podcasts");

            return (
              <PlaylistTrack
                onClick={() => {
                  dispatch(
                    loadPlaylist(
                      `https://play.anghami.com/${
                        isAlbum ? "album" : "playlist"
                      }/${playlist.id}`,
                      title
                    )
                  );
                }}
                key={playlist.id}
              >
                <TrackImage src={coverArt} />
                <TrackTitle>
                  <h4 className="text-sm font-bold text-white text-opacity-80 dark:text-black dark:text-opacity-80">
                    {title}
                  </h4>
                  <div className="text-xs text-white text-opacity-60 dark:text-black dark:text-opacity-80">
                    {isAlbum ? (
                      <span>{playlist.artist}</span>
                    ) : (
                      <span>Tracks: {playlist.count}</span>
                    )}
                  </div>
                </TrackTitle>
              </PlaylistTrack>
            );
          })}
        </PlaylistRoot>
      </Scrollbars>
    </Page>
  );
};
