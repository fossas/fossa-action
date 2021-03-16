import { addPath } from "@actions/core";
import { getOctokit } from "@actions/github";
import { extractZip, find, downloadTool, cacheFile} from "@actions/tool-cache";
import { GITHUB_TOKEN } from "./config";

const octokit = getOctokit(GITHUB_TOKEN);
const platform = getPlatform();

function getPlatform() {
  switch (process.platform) {
    case "win32":
      return "windows_amd64";
    case "darwin":
      return "darwin_amd64";
    default:
      return "linux_amd64";
  }
}

async function getLatestRelease() {
  // I don't like this method
  const {
    data: { assets, tag_name: version },
  } = await octokit.repos.getLatestRelease({
    owner: "fossas",
    repo: "spectrometer",
  });

  const [{ browser_download_url: browserDownloadUrl }] = assets.filter(
    (asset) => {
      // Find platform and ignore pathfinder binaries
      return asset.browser_download_url.includes(platform) && !asset.browser_download_url.includes('pathfinder');
    }
  );

  return { version, browserDownloadUrl };
}

async function extract(cliDownloadedPath: string) {
    const cliExtractedPath = await extractZip(cliDownloadedPath);
    return cliExtractedPath;
}

export async function fetchFossaCli(): Promise<void> {
  const { browserDownloadUrl, version } = await getLatestRelease();
  let cachedPath = find('fossa', version, platform);

  if (!cachedPath) {
    const downloadedPath = await downloadTool(browserDownloadUrl);
    const extractedPath = await extract(downloadedPath);
    cachedPath = await cacheFile(
      extractedPath,
      'fossa',
      version,
      platform
    );
  }

  addPath(cachedPath);
}
