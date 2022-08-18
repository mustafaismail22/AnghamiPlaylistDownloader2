import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import { downloadProgress } from "./app/slices/playlistSlice";
import { store } from "./app/store";
import { setCssVariables, setThemeMode } from "./app/utils";
import "./index.css";

setThemeMode(store.getState().profile.settings.themeMode);
setCssVariables();

window.onSongProgress &&
  window.onSongProgress((_, { percent, trackId, type }) => {
    store.dispatch(
      downloadProgress(trackId, {
        progress: percent,
        type,
      })
    );
  });

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
