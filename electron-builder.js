const { build: electronBuild, Platform } = require('electron-builder');

return electronBuild({
  config: {
    productName: 'Anghami Playlist Downloader',
    appId: 'mustafa.AnghamiPlaylistDownloader',
    asar: true,
    directories: {
      output: 'release/${version}',
    },
    files: ['dist/', 'package.json'],
    asarUnpack: 'dist/bin',
    compression: 'maximum',
    beforeBuild: (context) =>
      import('./scripts/beforeBuild.mjs').then((m) => m.default(context)),
    win: {
      target: [
        {
          target: 'nsis',
          arch: ['x64'],
        },
      ],
      artifactName: '${productName}_${version}.${ext}',
      icon: 'src/assets/icons/win/icon.ico',
    },
    nsis: {
      oneClick: true,
      deleteAppDataOnUninstall: true,
    },
    linux: {
      target: ['deb'],
      icon: 'src/assets/icons/mac/icon.icns',
      executableName: 'AnghamiPlaylistDownloader',
      category: 'AudioVideo',
      synopsis: 'Anghami Playlist Downloader',
      description: 'Anghami Playlist Downloader',
      maintainer: 'Mustafa',
    },
    deb: {
      depends: ['atomicparsley', 'ffmpeg'],
    },
  },
}).then((result) => {
  console.log('files:', result);
});
