import { addPath, debug } from '@actions/core';
import { exec } from '@actions/exec';
import { find, downloadTool, cacheDir, cacheFile, findAllVersions } from '@actions/tool-cache';
import * as fs from 'node:fs';

const CACHE_NAME = 'fossa';

function getPlatform() {
  switch (process.platform) {
  case 'win32':
    return 'windows_amd64';
  case 'darwin':
    return 'darwin_amd64';
  default:
    return 'linux_amd64';
  }
}

async function getInstaller() {
  const name = 'fossa-installer';
  const version = '1.0.0';
  const platform = getPlatform();
  let downloadPath = find(name, version, platform);

  if (!downloadPath) {
    downloadPath = await downloadTool(
      'https://raw.githubusercontent.com/fossas/fossa-cli/master/install-latest.sh',
    );

    await cacheFile(
      downloadPath,
      name,
      version,
      platform,
    );
  }

  return downloadPath;
}

export async function fetchFossaCli(): Promise<void> {
  const devNull = fs.createWriteStream('/dev/null', {flags: 'a'});
  const defaultOptions = {outStream: devNull};

  const installer = await getInstaller();
  const platform = getPlatform();

  // Get cached path
  const latestVersion = findAllVersions(CACHE_NAME, platform).sort().reverse()[0] || '-1'; // We'll never cache a version as -1
  let fossaPath = find(CACHE_NAME, latestVersion, platform);

  if (latestVersion) debug(`Using FOSSA version ${latestVersion}`);

  if (!fossaPath) {
    debug(`Fetching new FOSSA version`);

    if (await exec('bash', [installer, '-b', './fossa'], {...defaultOptions}) !== 0) {
      throw new Error(`Fossa failed to install correctly`);
    }

    let versionExecOut = '';
    const listeners = {
      stdout: (data: Buffer) => {
        versionExecOut += data.toString();
      },
    };

    await exec('./fossa/fossa', ['--version'], {listeners, ...defaultOptions});
    const version = versionExecOut.match(/version (\d+.\d+.\d+)/)[1] || 'nover';
    fossaPath = await cacheDir('./fossa/', CACHE_NAME, version, platform);

    debug(`Found FOSSA version ${version}`);
  }

  addPath(fossaPath);
  devNull.close();
}
