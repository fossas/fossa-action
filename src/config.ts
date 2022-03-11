import { getInput } from '@actions/core';

export const FOSSA_API_KEY = getInput('api-key', {required: true});
export const CONTAINER = getInput('container', {required: false});
export const RUN_TESTS = getInput('run-tests', {required: false}).toLocaleLowerCase() === 'true';
export const ENDPOINT = getInput('endpoint', {required: false});
export const BRANCH = getInput('branch', {required: false});
