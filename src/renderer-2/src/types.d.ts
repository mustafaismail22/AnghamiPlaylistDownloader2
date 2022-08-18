// import { ProfilePlaylists } from './store/profile/types';

interface Window {
  loginByUser: () => Promise<any>;
  checkLogin: () => Promise<any>;
  downloadTrack: (
    track: any,
    playlistTitle?: string,
    toMp3?: boolean
  ) => Promise<any>;
  getTracksDetails: (url: string) => Promise<any>;
  openExternal: (path: string) => Promise<any>;
  checkLikes: (likes: any) => Promise<any>;
  loadPlaylist: (playlistId: string, isAlbum?: boolean) => Promise<any>;
  onlineCheck: (...args: any[]) => Promise<number>;
  isOnline: () => Promise<boolean>;
  setProgressBar: (
    progress: number,
    options?: { mode: string }
  ) => Promise<any>;
  onSongProgress: (
    callback: (
      event: any,
      data: {
        trackId: string;
        percent: number;
        type: string;
      }
    ) => void
  ) => void;
  store: any;
}
