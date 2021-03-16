import { exec } from "@actions/exec";
import { FOSSA_API_KEY, RUN_TESTS } from './config';
import { fetchFossaCli } from "./download-cli";

export async function analyze(): Promise<void> {
  const PATH = process.env.PATH || '';
  const options = { env: { ...process.env, PATH, FOSSA_API_KEY} };

  await exec("fossa", ["analyze"], options);

  if (RUN_TESTS) {
    await exec("fossa", ["test"], options);
  }
}


async function run() {
  await fetchFossaCli();
  await analyze();
}

run();
