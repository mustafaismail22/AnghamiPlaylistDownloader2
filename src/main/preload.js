const { ipcRenderer, contextBridge } = require('electron');

contextBridge.exposeInMainWorld('isOnline', () =>
  ipcRenderer.invoke('isOnline')
);
contextBridge.exposeInMainWorld('onlineCheck', () =>
  ipcRenderer.invoke('onlineCheck')
);
contextBridge.exposeInMainWorld('loginByUser', () =>
  ipcRenderer.invoke('loginByUser')
);
contextBridge.exposeInMainWorld('checkLogin', () =>
  ipcRenderer.invoke('checkLogin')
);

contextBridge.exposeInMainWorld('getTracksDetails', (url) =>
  ipcRenderer.invoke('getTracksDetails', url)
);
contextBridge.exposeInMainWorld('openExternal', (path) =>
  ipcRenderer.invoke('openExternal', path)
);
contextBridge.exposeInMainWorld('checkLikes', (likes) =>
  ipcRenderer.invoke('checkLikes', likes)
);
contextBridge.exposeInMainWorld('loadPlaylist', (playlistId, isAlbum) =>
  ipcRenderer.invoke('loadPlaylist', playlistId, isAlbum)
);

contextBridge.exposeInMainWorld('setProgressBar', (progress, options) =>
  ipcRenderer.invoke('setProgressBar', progress, options)
);

contextBridge.exposeInMainWorld(
  'downloadTrack',
  (track, playlistTitle, toMp3) =>
    ipcRenderer.invoke('downloadTrack', track, playlistTitle, toMp3)
);

contextBridge.exposeInMainWorld('toggleDebug', (debug) =>
  ipcRenderer.invoke('toggleDebug', debug)
);

contextBridge.exposeInMainWorld('onSongProgress', (cb) => {
  ipcRenderer.on('songProgress', (event, data) => cb(event, data));
});
