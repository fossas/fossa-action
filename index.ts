import { error, setFailed } from '@actions/core';
import { exec } from '@actions/exec';
import { CONTAINER, FOSSA_API_KEY, RUN_TESTS } from './config';
import { fetchFossaCli } from './download-cli';

export async function analyze(): Promise<void> {
  const PATH = process.env.PATH || '';
  const options = { env: { ...process.env, PATH, FOSSA_API_KEY}};

  const getArgs = (cmd: string) => [CONTAINER ? 'container' : null, cmd].filter(arg => arg);

  if (await exec('fossa', [...getArgs('analyze'), CONTAINER], options) !== 0) {
    throw new Error(`FOSSA failed to scan`);
  }

  if (RUN_TESTS) {
    if (await exec('fossa', [...getArgs('test'), CONTAINER], options) !== 0) {
      throw new Error(`Fossa tests failed`);
    }
  }
}

async function run() {
  try {
    await fetchFossaCli();
  } catch (e) {
    error(`There was an error fetching FOSSA CLI. ${e}`);
  }

  try {
    await analyze();
  } catch (e) {
    setFailed(e);
  }
}

run();
