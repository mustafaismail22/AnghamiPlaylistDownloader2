import {
  getAtomicParsley,
  setAtomicParsleyDistPath,
} from 'anghami-bot/dist/utils/atomicparsley.js';
import { getffmpeg, setFfmpegDistPath } from 'anghami-bot/dist/utils/ffmpeg.js';
import jetpack from 'fs-jetpack';
import path from 'path';

export default async ({ appDir, arch, platform }) => {
  const platformName = platform.name
    .replace('windows', 'windows_nt')
    .replace('mac', 'darwin');
  console.log('beforeBuild', { appDir, arch, platformName, platform });
  const binDist = path.join(appDir, 'dist', 'bin');

  await jetpack.removeAsync(binDist);

  if (platformName === 'linux') {
    return;
  }

  const ffmpegDist = await jetpack.dir(binDist);
  const atomicparsleyDist = await jetpack.dir(binDist);

  setFfmpegDistPath(ffmpegDist.path());
  setAtomicParsleyDistPath(atomicparsleyDist.path());

  await getAtomicParsley(platformName);
  await getffmpeg({ type: platformName, arch });
};
