"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RUN_TESTS = exports.CONTAINER = exports.FOSSA_API_KEY = void 0;
const core_1 = require("@actions/core");
exports.FOSSA_API_KEY = core_1.getInput('api-key', { required: true });
exports.CONTAINER = core_1.getInput('container', { required: false });
exports.RUN_TESTS = core_1.getInput('run-tests', { required: false }).toLocaleLowerCase() === 'true';
//# sourceMappingURL=config.js.map