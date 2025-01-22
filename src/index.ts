import { error, setFailed, setOutput } from '@actions/core';
import { exec, ExecListeners } from '@actions/exec';
import {
  CONTAINER,
  FOSSA_API_KEY,
  RUN_TESTS,
  TEST_DIFF_REV,
  ENDPOINT,
  BRANCH,
  PROJECT,
  TEAM,
  POLICY,
  CONFIG,
  DEBUG,
  REPORT_FORMAT,
} from './config';
import { fetchFossaCli } from './download-cli';

// Github doesn't always collect exit codes correctly, so we check output
const failedRegex = /(A fatal error occurred|Test failed\. Number of issues found)/;

export async function analyze(): Promise<void> {
  const getEndpointArgs = (): string[] => !ENDPOINT ? [] : [
    '--endpoint',
    ENDPOINT,
  ];
  const getBranchArgs = (): string[] => !BRANCH ? [] : [
    '--branch',
    BRANCH,
  ];
  const getProjectArgs = (): string[] => !PROJECT ? [] : [
    '--project',
    PROJECT,
  ];
  const getTeamArgs = (): string[] => !TEAM ? [] : [
    '--team',
    TEAM,
  ];
  const getPolicyArgs = (): string[] => !POLICY ? [] : [
    '--policy',
    POLICY,
  ];
  const getConfigPath = (): string[] => !CONFIG ? [] : [
    '--config',
    CONFIG,
  ];

  const getArgs = (cmd: string[]) => [
    CONTAINER ? 'container' : null,
    ...cmd,
    ...getEndpointArgs(),
    ...getBranchArgs(),
    ...getProjectArgs(),
    ...getTeamArgs(),
    ...getPolicyArgs(),
    ...getConfigPath(),
    DEBUG ? '--debug' : null,
  ].filter(arg => arg);

  // Setup listeners
  let output;
  const collectOutput = (data: Buffer) => {
    output += data.toString();
  };

  const listeners: ExecListeners = {
    stdout: collectOutput,
    stderr: collectOutput,
  };

  // Collect default options: Env and listeners
  const PATH = process.env.PATH || '';
  const defaultOptions = { env: { ...process.env, PATH, FOSSA_API_KEY }, listeners };

  if (!RUN_TESTS) {
    output = '';
    const exitCode = await exec('fossa', [...getArgs(['analyze']), CONTAINER], defaultOptions);

    // Check output or exitCode
    if (exitCode !== 0 || output.match(failedRegex)) {
      throw new Error(`FOSSA failed to scan`);
    }
  } else if (RUN_TESTS) {
    output = '';
    const args = [...getArgs(['test']), CONTAINER];

    if (TEST_DIFF_REV && TEST_DIFF_REV !== '') {
      args.push('--diff', TEST_DIFF_REV);
    }

    const exitCode = await exec('fossa', args, defaultOptions);

    // Check output or exitCode
    if (exitCode !== 0 || output.match(failedRegex)) {
      throw new Error(`Fossa tests failed`);
    }
  }
}

export async function report(): Promise<void> {
  const getEndpointArgs = (): string[] => !ENDPOINT ? [] : [
    '--endpoint',
    ENDPOINT,
  ];
  const getProjectArgs = (): string[] => !PROJECT ? [] : [
    '--project',
    PROJECT,
  ];
  const getFormatArgs = (): string[] => !REPORT_FORMAT ? [] : [
    '--format',
    REPORT_FORMAT,
  ];

  const getArgs = (cmd: string[]) => [
    ...cmd,
    ...getEndpointArgs(),
    ...getProjectArgs(),
    ...getFormatArgs(),
    DEBUG ? '--debug' : null,
  ].filter(arg => arg);

  // Setup listeners
  let stdout = '';
  let stderr = '';
  const collectStdout = (data: Buffer) => {
    stdout += data.toString();
  };
  const collectStderr = (data: Buffer) => {
    stderr += data.toString();
  };

  const listeners: ExecListeners = {
    stdout: collectStdout,
    stderr: collectStderr,
  };

  // Collect default options: Env and listeners
  const PATH = process.env.PATH || '';
  const defaultOptions = { env: { ...process.env, PATH, FOSSA_API_KEY }, listeners };
  const exitCode = await exec('fossa', getArgs(['report', 'attribution']), defaultOptions);

  // Check output or exitCode
  if (exitCode !== 0 || stderr.match(failedRegex)) {
    throw new Error(`FOSSA failed to scan`);
  }

  setOutput('report', stdout);
}

async function run() {
  try {
    await fetchFossaCli();
  } catch (e) {
    error(`There was an error fetching FOSSA CLI. ${e}`);
  }

  try {
    await analyze();
    if (REPORT_FORMAT?.length) {
      await report();
    }
  } catch (e) {
    setFailed(e);
  }
}

run();
