import { getInput } from '@actions/core';

export const FOSSA_API_KEY = getInput('api-key', {required: true});
export const CONTAINER = getInput('container', {required: false});
export const RUN_TESTS = getInput('RUN_TESTS', {required: false}).toLocaleLowerCase() === 'true';
