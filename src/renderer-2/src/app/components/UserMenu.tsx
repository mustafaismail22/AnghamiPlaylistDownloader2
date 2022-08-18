import classNames from "classnames";
import React from "react";
import ReactLoading from "react-loading";
import { useAppDispatch, useAppSelector } from "../hooks";
import { loadMyAlbumsPage, loadMyPlaylistsPage } from "../slices/pageSlice";
import { loadMyLikesPlaylist } from "../slices/playlistSlice";
import {
  login,
  logOut,
  selectProfileStatus,
  selectSettings,
  toggleLightMode,
} from "../slices/profileSlice";
import { Button } from "./Form";
import {
  DarkMode,
  IconAlbum,
  IconExit,
  IconFace,
  IconFavorite,
  IconList,
  IconRefresh,
  LightMode,
} from "./Icons";
import { Menu, MenuItem, useMenu } from "./Menu";

export function UserMenu() {
  const [isOpen, toggleMenu, refNode] = useMenu();
  const status = useAppSelector(selectProfileStatus);
  const settings = useAppSelector(selectSettings);
  const dispatch = useAppDispatch();

  return (
    <div ref={refNode} className="relative">
      <Button
        loading={status == "loading"}
        onClick={(e) => {
          e.preventDefault();
          toggleMenu(!isOpen);
        }}
      >
        <IconFace />
      </Button>

      <Menu open={isOpen}>
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            dispatch(loadMyLikesPlaylist());
          }}
        >
          <IconFavorite className="h-4 w-5 fill-white opacity-80" />
          My Likes
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            dispatch(loadMyPlaylistsPage());
          }}
        >
          <IconList className="h-5 w-5 fill-white opacity-80" />
          My Playlists
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            dispatch(loadMyAlbumsPage());
          }}
        >
          <IconAlbum className="h-4 w-5 fill-white opacity-80" />
          My Albums
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            dispatch(login(true));
          }}
        >
          {status == "loading" ? (
            <ReactLoading
              type="spin"
              className="mx-0.5 !h-4 !w-4 fill-white opacity-80"
            />
          ) : (
            <IconRefresh className="h-5 w-5 fill-white opacity-80" />
          )}
          Refresh
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            dispatch(toggleLightMode());
          }}
        >
          <div className="relative h-4 w-5">
            <DarkMode
              className={classNames(
                "absolute inset-0 h-full w-full fill-white opacity-80 transition-all",
                {
                  "visible scale-100 opacity-100 duration-200":
                    settings.themeMode == "light",
                  "invisible scale-0 opacity-0 duration-[0ms]":
                    settings.themeMode != "light",
                }
              )}
            />

            <LightMode
              className={classNames(
                "absolute inset-0 h-full w-full fill-white opacity-80 transition-all",
                {
                  "visible scale-100 opacity-100 duration-200":
                    settings.themeMode == "dark",
                  "invisible scale-0 opacity-0 duration-[0ms]":
                    settings.themeMode != "dark",
                }
              )}
            />
          </div>
          {settings.themeMode == "light" ? "Dark Mode" : "Light Mode"}
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            e.preventDefault();
            dispatch(logOut());
          }}
        >
          <IconExit className="h-4 w-5 fill-white opacity-80" />
          Log out
        </MenuItem>
      </Menu>
    </div>
  );
}
