import { exec } from '@actions/exec';
import { CONTAINER, FOSSA_API_KEY, RUN_TESTS } from './config';
import { fetchFossaCli } from './download-cli';

export async function analyze(): Promise<void> {
  const PATH = process.env.PATH || '';
  const options = { env: { ...process.env, PATH, FOSSA_API_KEY} };

  const getArgs = (cmd: string) => {
    const args = [cmd];
    if (CONTAINER) args.unshift('container');

    return args;
  };

  await exec('fossa', [...getArgs('analyze'), CONTAINER], options);

  if (RUN_TESTS) {
    await exec('fossa', [...getArgs('test'), CONTAINER], options);
  }
}

async function run() {
  await fetchFossaCli();
  await analyze();
}

run();
