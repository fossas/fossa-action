import { getInput } from '@actions/core';

export const GITHUB_TOKEN = getInput('github-token', {required: true});
export const FOSSA_API_KEY = getInput('api-key', {required: true});
export const RUN_TESTS = getInput('RUN_TESTS', {required: false}).toLocaleLowerCase() === "true";
