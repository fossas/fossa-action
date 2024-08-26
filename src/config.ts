import { getInput, getBooleanInput } from '@actions/core';
import type { InputOptions } from '@actions/core';

//  Helper to return the InputOptions for each call.
const getInputOptions = (required: boolean = false): InputOptions => ({
  required,
  trimWhitespace: true,
});

export const FOSSA_API_KEY = getInput('api-key', getInputOptions(true));
export const CONTAINER = getInput('container', getInputOptions());
export const RUN_TESTS = getBooleanInput('run-tests', {required: false});
export const TEST_DIFF_REV = getInput('test-diff-revision', {required: false});
export const ENDPOINT = getInput('endpoint', getInputOptions());
export const BRANCH = getInput('branch', getInputOptions());
export const PROJECT = getInput('project', getInputOptions());
export const TEAM = getInput('team', {required: false});
export const POLICY = getInput('policy', {required: false});
export const DEBUG = getBooleanInput('debug', {required: false});
