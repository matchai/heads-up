import got from "got";
import * as core from "@actions/core";
import { writeTimings } from "./write";
import * as git from "./git";

export interface Timings {
  wait?: number;
  dns?: number;
  tcp?: number;
  tls?: number;
  request?: number;
  firstByte?: number;
  download?: number;
  total?: number;
}

async function main(): Promise<void> {
  const url: string = core.getInput("url");
  const response = await got(url);
  const timings: Timings = response.timings.phases;
  core.debug(`Request succesfully made: ${url}`);

  await git.checkout("gh-pages");
  await writeTimings(timings);
  core.debug("Timings extracted");

  await git.publish(`✅ ${url} – ${timings.total}ms`);
  core.debug("Heads-up run completed!")
}

main().catch(e => core.setFailed(e.message));
