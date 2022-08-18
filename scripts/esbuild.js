const path = require('path');
const esbuild = require('esbuild');

const srcPath = path.resolve(__dirname, '..', 'src', 'main');
const distPath = path.resolve(__dirname, '..', 'dist', 'main');

if (process.argv.length < 3) {
  showUsage();
}

if (!['dev', 'prod'].includes(process.argv[2])) {
  showUsage();
}

// production mode, or not
const production = process.argv[2] === 'prod';

// esbuild watch in dev mode to rebuild out files
let watch = false;
if (!production) {
  watch = {
    onRebuild(error) {
      if (error) {
        console.error('ESBuild: Watch build failed:', error.getMessage());
      } else {
        console.log('ESBuild: Watch build succeeded');
      }
    },
  };
}

esbuild
  .build({
    entryPoints: [
      path.join(srcPath, 'main.mjs'),
      path.join(srcPath, 'preload.js'),
    ],
    define: {
      'process.env.NODE_ENV': production ? '"production"' : '"development"',
      'process.env.FLUENTFFMPEG_COV': '0',
    },
    outdir: distPath,
    external: ['electron'],
    platform: 'node',
    minify: production,
    bundle: true,
    write: true,
    // watch,
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .then(async (result) => {
    console.log('ESBuild Done', { result });
  });

function showUsage() {
  console.log('USAGE');
  console.log('node esbuild.js dev');
  console.log('node esbuild.js prod');
  process.exit(0);
}
