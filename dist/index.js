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
exports.analyze = void 0;
const core_1 = require("@actions/core");
const exec_1 = require("@actions/exec");
const config_1 = require("./config");
const download_cli_1 = require("./download-cli");
function analyze() {
    return __awaiter(this, void 0, void 0, function* () {
        // Github doesn't always collect exit codes correctly, so we check output
        const failedRegex = /(A fatal error occurred|Test failed\. Number of issues found)/;
        const getArgs = (cmd) => [config_1.CONTAINER ? 'container' : null, cmd].filter(arg => arg);
        // Setup listeners
        let output;
        const collectOutput = (data) => {
            output += data.toString();
        };
        const listeners = {
            stdout: collectOutput,
            stderr: collectOutput,
        };
        // Collect default options: Env and listeners
        const PATH = process.env.PATH || '';
        const defaultOptions = { env: Object.assign(Object.assign({}, process.env), { PATH, FOSSA_API_KEY: config_1.FOSSA_API_KEY }), listeners };
        if (!config_1.RUN_TESTS) {
            output = '';
            const exitCode = yield exec_1.exec('fossa', [...getArgs('analyze'), config_1.CONTAINER], defaultOptions);
            // Check output or exitCode
            if (exitCode !== 0 || output.match(failedRegex)) {
                throw new Error(`FOSSA failed to scan`);
            }
        }
        else if (config_1.RUN_TESTS) {
            output = '';
            const exitCode = yield exec_1.exec('fossa', [...getArgs('test'), config_1.CONTAINER], defaultOptions);
            // Check output or exitCode
            if (exitCode !== 0 || output.match(failedRegex)) {
                throw new Error(`Fossa tests failed`);
            }
        }
    });
}
exports.analyze = analyze;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield download_cli_1.fetchFossaCli();
        }
        catch (e) {
            core_1.error(`There was an error fetching FOSSA CLI. ${e}`);
        }
        try {
            yield analyze();
        }
        catch (e) {
            core_1.setFailed(e);
        }
    });
}
run();
//# sourceMappingURL=index.js.map