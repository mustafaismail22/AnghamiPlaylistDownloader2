import { setAtomicParsleyDistPath } from 'anghami-bot/dist/utils/atomicparsley.js';
import { setFfmpegDistPath } from 'anghami-bot/dist/utils/ffmpeg.js';
import dateFormat from 'dateformat';
import { app, shell } from 'electron';
import jetpack from 'fs-jetpack';
import os from 'os';
import path from 'path';
import sanitize from 'sanitize-filename';
import { fileURLToPath } from 'url';
import which from 'which';

export const isWindows = os.platform() === 'win32';
export const isLinux = os.platform() === 'linux';

export const tempDir = jetpack.cwd(
  app.getPath('temp'),
  'AnghamiPlaylistDownloader'
);

export const localDataDir = jetpack.cwd(app.getPath('userData'));

export const downloadDir = jetpack.cwd(
  app.getPath('downloads'),
  'Anghami Playlist Downloader'
);

export const logFilePath = tempDir.path(`logs/${dateFormat('isoDate')}.log`);

export function getDirname(url) {
  const __filename = fileURLToPath(url);
  const __dirname = path.dirname(__filename);
  return __dirname;
}

export function wait(time) {
  return new Promise((r) => setTimeout(r, time));
}

export async function isDownloaded(ids = [], dirPath) {
  if (!Array.isArray(ids)) {
    ids = [ids];
  }

  if (!dirPath) {
    dirPath = downloadDir.path();
  } else {
    dirPath = downloadDir.path(sanitize(dirPath).replace(/\&/g, ''));
  }

  let files = [];
  if (await jetpack.existsAsync(dirPath)) {
    files = await jetpack.findAsync(dirPath, {
      matching: `./*.*(mp3|mp4|m4a)`,
    });
  }

  return ids.map((id) => {
    let file = files.find((file) => {
      return file.includes(`t${id}`);
    });

    file = file ? path.resolve(file) : file;

    return {
      id,
      selected: !file,
      state: !!file ? 'downloaded' : null,
      filePath: file,
    };
  });
}

export async function openExternal(filePath) {
  filePath = path.resolve(filePath);
  if ((await jetpack.existsAsync(filePath)) == 'file') {
    console.log(`Opening file => ${filePath}`);
    return !!(await shell.openPath(filePath).catch(() => {
      console.log(`Failed to open file => ${filePath}`);
      return false;
    }));
  }
  console.log(`File doesn't exist => ${filePath}`);
  return false;
}

export async function setffmpeg() {
  try {
    if (isLinux) {
      setFfmpegDistPath(
        await which('ffmpeg').then((_path) => path.dirname(_path))
      );

      setAtomicParsleyDistPath(
        await which('ffmpeg').then((_path) => path.dirname(_path))
      );
      return;
    }

    let binPath = '';
    if (app.isPackaged) {
      binPath = path.join(
        app.getAppPath().replace('app.asar', 'app.asar.unpacked'),
        'dist',
        'bin'
      );
    } else {
      binPath = localDataDir.dir('bin').path();
    }
    setFfmpegDistPath(binPath);
    setAtomicParsleyDistPath(binPath);
  } catch (error) {
    console.error(error);
  }
}
