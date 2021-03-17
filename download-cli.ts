import { addPath } from '@actions/core';
import { exec } from '@actions/exec';
import { find, downloadTool, cacheDir, cacheFile} from '@actions/tool-cache';

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
      'https://raw.githubusercontent.com/fossas/spectrometer/master/install.sh',
    );

    await cacheFile(
      downloadPath,
      'fossa-installer',
      '1.0.0',
      'linux',
    );
  }

  return downloadPath;
}

export async function fetchFossaCli(): Promise<void> {
  const installer = await getInstaller();
  const platform = getPlatform();

  let fossaPath = find('fossa', '1', platform); // Find - findAllVersions?

  if (!fossaPath) {
    await exec('bash', [installer, '-b', './fossa']);
    fossaPath = await cacheDir('./fossa/', 'fossa', '1', platform);
  }

  addPath(fossaPath);
}
