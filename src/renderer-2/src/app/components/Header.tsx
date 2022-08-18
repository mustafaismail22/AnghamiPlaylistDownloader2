import * as React from "react";
import { useAppDispatch, useAppSelector } from "../hooks";
import {
  login,
  selectProfileLoggedIn,
  selectProfileStatus,
} from "../slices/profileSlice";
import { Button } from "./Form";
import { IconMusic } from "./Icons";
import { UserMenu } from "./UserMenu";

export function Header() {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectProfileStatus);
  const isLoggedIn = useAppSelector(selectProfileLoggedIn);

  return (
    <header className="border-b border-black border-opacity-20 bg-black bg-opacity-20 text-white dark:bg-opacity-5 dark:text-black dark:text-opacity-80">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-2">
          <div className="-my-2 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary shadow">
            <IconMusic />
          </div>
          <h1 className="text-xl font-bold">Anghami Playlist Downloader</h1>
        </div>
        {isLoggedIn ? (
          <UserMenu />
        ) : (
          <Button
            loading={status == "loading"}
            onClick={() => dispatch(login())}
          >
            Log in to Anghami
          </Button>
        )}
      </div>
    </header>
  );
}
