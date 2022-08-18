import { writeCoverM4aFs } from 'anghami-bot/dist/utils/atomicparsley.js';
import {
  convertToMp3Fs,
  writeTagsFs,
  writeTagsMp3,
} from 'anghami-bot/dist/utils/convert.js';
import { ipcMain } from 'electron';
import lodash from 'lodash';
import { normalize } from 'path';
import sanitize from 'sanitize-filename';
import { downloadDir, tempDir } from './utils.mjs';

export async function downloadTrack(
  bot,
  track,
  playlistTitle = '',
  toMp3 = false
) {
  try {
    console.log('');
    console.log(
      `Downloading '${track.title}' / '${playlistTitle}' ...`
      // , {
      //   playlistTitle,
      //   toMp3,
      //   track: { id: track.id, title: track.title }
      // }
    );

    const _song = await bot.song.getSongInfo(track.id);

    if (!_song || !_song.track) {
      throw new Error('Error');
    }

    let progressType = 'song';
    const downloadSongOnProgress = lodash.throttle((track, type, progress) => {
      if (type == 'song' && progressType == 'song') {
        ipcMain.emit('songProgress', {
          trackId: track.id,
          percent: progress.percent * 100,
          type,
        });
      }
    }, 100);

    const {
      song,
      cover,
      track: _track,
    } = await bot.song.downloadSong(
      {
        ..._song.track,
        location: _song.location,
        lyricsData: _song.lyricsData,
      },
      downloadSongOnProgress
    );

    track = lodash.merge({}, _track, track);

    progressType = toMp3 ? 'convert-mp3' : 'convert';
    const convertSongOnProgress = lodash.throttle((progress) => {
      ipcMain.emit('songProgress', {
        trackId: track.id,
        percent: progress.percent,
        type: progressType,
      });
    }, 100);

    if (track.is_podcast) {
      progressType = 'convert';
      convertSongOnProgress({ percent: 1 });

      const outputFileName = sanitize(
        `${track.title.trim()} - t${track.id}.${song.ext || 'm4a'}`
      ).replace(/\&/g, '');

      const outputFilePath = downloadDir.path(
        sanitize(playlistTitle).replace(/\&/g, ''),
        outputFileName
      );

      await downloadDir.fileAsync(outputFilePath, {
        mode: '777',
        content: song.buffer,
      });

      console.log(`Done Podcast,  FilePath => '${normalize(outputFilePath)}'`);

      return {
        ...track,
        state: 'downloaded',
        // selected: false,
        filePath: outputFilePath,
      };
    }

    convertSongOnProgress({ percent: 1 });

    const tempFilePath = tempDir.path(`temp-${song.name}`);
    await tempDir.fileAsync(tempFilePath, {
      mode: '777',
      content: song.buffer,
    });

    const tempCoverPath = tempDir.path(`temp-${cover.name}`);
    await tempDir.fileAsync(tempCoverPath, {
      mode: '777',
      content: cover.buffer,
    });

    // console.log(`TempFilePath => '${tempFilePath}'`);
    // console.log(`TempCoverPath => '${tempCoverPath}'`);

    let fileBuffer;
    if (toMp3) {
      console.log(`Converting '${tempFilePath}' to MP3 ...`);
      fileBuffer = await convertToMp3Fs(tempFilePath, convertSongOnProgress);
      fileBuffer = await writeTagsMp3(track, fileBuffer, cover.buffer);
    } else {
      fileBuffer = await writeTagsFs(track, tempFilePath, tempCoverPath);
    }

    const outputFileName = sanitize(
      `${track.title.trim()} - t${track.id}.${toMp3 ? 'mp3' : 'm4a'}`
    ).replace(/\&/g, '');

    const outputFilePath = downloadDir.path(
      sanitize(playlistTitle).replace(/\&/g, ''),
      outputFileName
    );

    if (toMp3) {
      await downloadDir.fileAsync(outputFilePath, {
        mode: '777',
        content: fileBuffer,
      });
    } else {
      const _tempFilePath = tempDir.path(`temp-tags-${song.name}`);
      // console.log({ _tempFilePath });
      await tempDir.fileAsync(_tempFilePath, {
        mode: '777',
        content: fileBuffer,
      });

      await writeCoverM4aFs(_tempFilePath, tempCoverPath, track);
      await downloadDir.moveAsync(_tempFilePath, outputFilePath);
    }

    console.log(`Done, FilePath => '${normalize(outputFilePath)}'`);
    console.log('');

    return {
      ...track,
      state: 'downloaded',
      // selected: false,
      filePath: outputFilePath,
    };
  } catch (error) {
    console.error(error);
    return Promise.reject(error);
  }
}
