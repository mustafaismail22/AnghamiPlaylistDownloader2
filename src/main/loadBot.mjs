import { AnghamiBot } from 'anghami-bot/dist/Bot.js';
import { Browser as AnghamiBrowser } from 'anghami-bot/dist/Browser.js';
import { setLogConfig } from 'anghami-bot/dist/Logger.js';
import { app, BrowserWindow, ipcMain } from 'electron';
import puppeteer from 'puppeteer-core';
import { downloadTrack } from './downloadTrack.mjs';
import { getTracksDetails } from './getTracksDetails.mjs';
import { logFilePath, openExternal, setffmpeg } from './utils.mjs';

export async function loadBot(mainWindow, pie) {
  setLogConfig(logFilePath);
  await setffmpeg();

  const bot = new AnghamiBot();
  const browser = await pie.connect(app, puppeteer);

  bot.browser.browser = browser;
  bot.browser.newPage = async (options) => {
    const [width, height] = [1280, 740];
    const anghamiWindow = new BrowserWindow({
      show: options && options.show,
      autoHideMenuBar: true,
      backgroundColor: '#2b2e3b',
      darkTheme: true,
      center: true,
      width,
      height,
    });
    const page = await pie.getPage(browser, anghamiWindow);
    page.goto = async (url, options) => {
      try {
        console.log(`Loading ${url}`);
        await anghamiWindow.loadURL(url, {
          userAgent: AnghamiBrowser.userAgent,
        });
        await page.waitForSelector('body > *', { timeout: 1000 * 10 });
        return Promise.resolve();
      } catch (error) {
        return Promise.reject(error);
      }
    };

    await page.setUserAgent(AnghamiBrowser.userAgent);
    await page.setViewport({ width, height });
    await page.setDefaultNavigationTimeout(90000);
    await page.setBypassCSP(true);
    return page;
  };

  ipcMain.handle('loginByUser', () => bot.login.byUser({ show: true }));
  ipcMain.handle('checkLogin', () => bot.login.checkLogin());
  ipcMain.handle('getTracksDetails', (_, url) => getTracksDetails(bot, url));
  ipcMain.handle('checkLikes', (_, likes) => {
    return getTracksDetails(
      bot,
      `'https://play.anghami.com/playlist/${likes.id}'`
    );
  });

  ipcMain.handle('onlineCheck', () => true);
  ipcMain.handle('openExternal', (_, path) => openExternal(path));
  ipcMain.handle('loadPlaylist', (_, playlistId, isAlbum) =>
    bot.playlist.getPlaylist(playlistId, isAlbum)
  );

  ipcMain.handle('downloadTrack', (_, track, playlistTitle, toMp3) => {
    return downloadTrack(bot, track, playlistTitle, toMp3);
  });

  ipcMain.handle('setProgressBar', (_, progress, options) => {
    return mainWindow && mainWindow.setProgressBar(progress, options);
  });

  ipcMain.on('songProgress', (data) => {
    mainWindow.webContents.send('songProgress', data);
  });
}
