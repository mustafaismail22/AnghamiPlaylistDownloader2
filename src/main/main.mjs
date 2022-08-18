import { app, BrowserWindow } from 'electron';
import { platform } from 'os';
import path from 'path';
import pie from 'puppeteer-in-electron';

const main = async () => {
  console.time('mainWindow.show');
  const appTitle = 'Anghami Playlist Downloader';
  console.log(`${appTitle}\n${'*'.repeat(appTitle.length)}\n`);

  await pie.initialize(app);
  await app.whenReady();

  const mainWindow = new BrowserWindow({
    center: true,
    darkTheme: true,
    icon: path.join(
      __dirname,
      '..',
      'assets',
      ...(platform() === 'linux' ? ['icon.png'] : ['icons', 'win', 'icon.ico'])
    ),
    title: appTitle,
    autoHideMenuBar: true,
    backgroundColor: '#2b2e3b',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    width: 700,
    height: 600,
    show: false,
  });

  if (process.env.NODE_ENV !== 'production') {
    await import('electron-devtools-installer').then(
      ({
        default: {
          default: installExtension,
          REACT_DEVELOPER_TOOLS,
          REDUX_DEVTOOLS,
        },
      }) => {
        return Promise.all([
          installExtension(REACT_DEVELOPER_TOOLS),
          installExtension(REDUX_DEVTOOLS),
        ])
          .then((names) => console.log(`Added Extension:  ${names.join(', ')}`))
          .catch((err) => console.log('An error occurred: ', err));
      }
    );
  }

  Promise.all([
    process.env.NODE_ENV !== 'production'
      ? mainWindow.loadURL('http://localhost:1234').finally(() => {
          mainWindow.show();
          console.timeEnd('mainWindow.show');
        })
      : mainWindow
          .loadFile(path.join(__dirname, '../renderer', 'index.html'))
          .finally(() => {
            mainWindow.show();
            console.timeEnd('mainWindow.show');
          }),

    import('./loadBot.mjs').then(({ loadBot }) => {
      loadBot(mainWindow, pie);
    }),
  ]);

  app.on(
    'second-instance',
    (_event, _commandLine, _workingDirectory, _additionalData) => {
      // Someone tried to run a second instance, we should focus our window.
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      }
    }
  );

  app.on('window-all-closed', () => {
    app.quit();
  });

  mainWindow.on('closed', () => {
    app.quit();
  });

  process.on('exit', () => {
    app.quit();
  });
};

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  main();
}
