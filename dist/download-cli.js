"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchFossaCli = void 0;
const core_1 = require("@actions/core");
const exec_1 = require("@actions/exec");
const tool_cache_1 = require("@actions/tool-cache");
const fs = require("fs");
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
function getInstaller() {
    return __awaiter(this, void 0, void 0, function* () {
        const name = 'fossa-installer';
        const version = '1.0.0';
        const platform = getPlatform();
        let downloadPath = tool_cache_1.find(name, version, platform);
        if (!downloadPath) {
            downloadPath = yield tool_cache_1.downloadTool('https://raw.githubusercontent.com/fossas/spectrometer/master/install.sh');
            yield tool_cache_1.cacheFile(downloadPath, name, version, platform);
        }
        return downloadPath;
    });
}
function fetchFossaCli() {
    return __awaiter(this, void 0, void 0, function* () {
        const devNull = fs.createWriteStream('/dev/null', { flags: 'a' });
        const defaultOptions = { outStream: devNull };
        const installer = yield getInstaller();
        const platform = getPlatform();
        // Get cached path
        const latestVersion = tool_cache_1.findAllVersions(CACHE_NAME, platform).sort().reverse()[0] || '-1'; // We'll never cache a version as -1
        let fossaPath = tool_cache_1.find(CACHE_NAME, latestVersion, platform);
        if (latestVersion)
            core_1.debug(`Using FOSSA version ${latestVersion}`);
        if (!fossaPath) {
            core_1.debug(`Fetching new FOSSA version`);
            if ((yield exec_1.exec('bash', [installer, '-b', './fossa'], Object.assign({}, defaultOptions))) !== 0) {
                throw new Error(`Fossa failed to install correctly`);
            }
            let versionExecOut = '';
            const listeners = {
                stdout: (data) => {
                    versionExecOut += data.toString();
                },
            };
            yield exec_1.exec('./fossa/fossa', ['--version'], Object.assign({ listeners }, defaultOptions));
            const version = versionExecOut.match(/version (\d.\d.\d)/)[1] || 'nover';
            fossaPath = yield tool_cache_1.cacheDir('./fossa/', CACHE_NAME, version, platform);
            core_1.debug(`Found FOSSA version ${version}`);
        }
        core_1.addPath(fossaPath);
        devNull.close();
    });
}
exports.fetchFossaCli = fetchFossaCli;
//# sourceMappingURL=download-cli.js.map