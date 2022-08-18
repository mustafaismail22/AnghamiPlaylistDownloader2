import React from "react";
import { Header } from "./app/components/Header";
import { useAppSelector } from "./app/hooks";
import { HomeScreen } from "./app/screens/HomeScreen";
import { MyPlaylistsScreen } from "./app/screens/MyPlaylistsScreen";
import { PlaylistsScreen } from "./app/screens/PlaylistsScreen";

function App(): JSX.Element {
  const pageType = useAppSelector((state) => state.page.type);

  return (
    <div className="App flex h-screen flex-col">
      <Header />
      <div className="container mx-auto flex-1 px-4 py-4">
        {pageType === "home" ? <HomeScreen /> : null}
        {pageType === "playlist" ? <PlaylistsScreen /> : null}
        {["my-playlists", "my-albums"].includes(pageType) ? (
          <MyPlaylistsScreen />
        ) : null}
      </div>
    </div>
  );
}

export default App;
