import { findUrlType } from 'anghami-bot/dist/utils/index.js';
import lodash from 'lodash';
import { isDownloaded } from './utils.mjs';

export async function getTracksDetails(bot, url, likes = null) {
  try {
    let urlType = findUrlType(url);
    let result = null;

    if (likes) {
      result = likes;
      urlType = {
        type: 'likes',
        id: likes.id,
      };
    }

    console.log(`Loading ${urlType.type}... id => ${urlType.id}`);

    if (!urlType) {
      return null;
    }

    if (urlType.type == 'song' || urlType.type == 'episode') {
      const { track } = await bot.song.getSongInfo(urlType.id);

      if (!track) {
        return null;
      }

      result = {
        id: track.id,
        type: 'song',
        title: track.title,
        coverArt: track.coverArt,
        count: 1,
        tracks: {
          [track.id]: track,
        },
      };
    }

    const isAlbum = urlType.type == 'album' || urlType.type == 'podcast';
    if (urlType.type == 'playlist' || isAlbum) {
      const playlist = await bot.playlist.getPlaylist(urlType.id, isAlbum);
      playlist.title = (playlist.title || '')
        .replace('$1234567890DOWNLOADED#', 'My Downloads')
        .replace('$1234567890LIKED#', 'My Likes')
        .replace('$1234567890PODCASTS#', 'My Podcasts');

      result = {
        id: playlist.id,
        type: 'playlist',
        title:
          isAlbum && !playlist.is_podcast
            ? `${playlist.artist} - ${playlist.title}`
            : playlist.title,
        coverArt: playlist.coverArt,
        count: playlist.count,
        tracks: playlist.tracks,
      };
    }

    // console.log(result);
    const downloadedFiles = await isDownloaded(
      Object.keys(result.tracks),
      result.title
    );

    for (const trackId of Object.keys(result.tracks)) {
      const track = result.tracks[trackId];
      result.tracks[trackId] = {
        ...lodash.find(downloadedFiles, { id: trackId }),
        ...track,
      };
    }

    console.log(
      `Done, id => ${result.id}, title => ${result.title}, count => ${result.count} \n`
    );

    return result;
  } catch (error) {
    console.error(error);
    return null;
  }
}
