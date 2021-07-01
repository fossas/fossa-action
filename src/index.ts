import { error, setFailed } from '@actions/core';
import { exec } from '@actions/exec';
import { CONTAINER, FOSSA_API_KEY, RUN_TESTS } from './config';
import { fetchFossaCli } from './download-cli';

export async function analyze(): Promise<void> {
  // Github doesn't always collect exit codes correctly, so we check output
  const failedRegex = /(A fatal error occurred|Test failed\. Number of issues found)/;
  const getArgs = (cmd: string) => [CONTAINER ? 'container' : null, cmd].filter(arg => arg);

  // Setup listeners
  let output;
  const collectOutput = (data: Buffer) => {
    output += data.toString();
  };

  const listeners = {
    stdout: collectOutput,
    stderr: collectOutput,
  };

  // Collect default options: Env and listeners
  const PATH = process.env.PATH || '';
  const defaultOptions = { env: { ...process.env, PATH, FOSSA_API_KEY}, listeners};

  if (!RUN_TESTS) {
    output = '';
    const exitCode = await exec('fossa', [...getArgs('analyze'), CONTAINER], defaultOptions);

    // Check output or exitCode
    if (exitCode !== 0 || output.match(failedRegex)) {
      throw new Error(`FOSSA failed to scan`);
    }
  } else if (RUN_TESTS) {
    output = '';
    const exitCode = await exec('fossa', [...getArgs('test'), CONTAINER], defaultOptions);

    // Check output or exitCode
    if (exitCode !== 0 || output.match(failedRegex)) {
      throw new Error(`Fossa tests failed`);
    }
  }
}

async function run() {
  try {
    await fetchFossaCli();
  } catch (e) {
    console.log(e.stack);
    error(`There was an error fetching FOSSA CLI. ${e}`);
  }

  try {
    await analyze();
  } catch (e) {
    setFailed(e);
  }
}

run();
