import React, { useState } from "react";
import { Button, CheckBoxInput, TextInput } from "../components/Form";
import { Page } from "../components/Page";
import { useAppDispatch, useAppSelector } from "../hooks";
import { selectPageErrors } from "../slices/pageSlice";
import { loadPlaylist } from "../slices/playlistSlice";
import { profileActions, selectSettings } from "../slices/profileSlice";

const SettingsPage = () => {
  const settings = useAppSelector(selectSettings);
  const despatch = useAppDispatch();

  return (
    <Page title="Settings">
      <label className="block">
        <CheckBoxInput
          name="convert"
          checked={settings.convert}
          onChange={() => despatch(profileActions.toggleConvert())}
        />
        Convert to mp3
      </label>
    </Page>
  );
};

const SongPage = () => {
  const errors = useAppSelector(selectPageErrors);
  const [url, setUrl] = useState("");

  return (
    <Page title="Song / Playlist / Album URL:">
      {errors.length ? (
        <div className="flex flex-col gap-1">
          {errors.map((error) => (
            <div
              key={error.type}
              className="rounded bg-primary px-2 py-1 text-xs text-white"
            >
              {error.massage}
            </div>
          ))}
        </div>
      ) : null}

      <div className="py-2">
        <TextInput
          type="url"
          name="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full"
          placeholder="eg. https://play.anghami.com/song/17486903"
        />
      </div>
    </Page>
  );
};

export function HomeScreen() {
  const dispatch = useAppDispatch();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        console.log("submit", e);
        dispatch(loadPlaylist(e.currentTarget.elements.url.value));
      }}
    >
      <SongPage />
      <SettingsPage />
      <Button>Next</Button>
    </form>
  );
}
