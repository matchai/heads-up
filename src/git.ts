import deploy from "github-pages-deploy-action";
import * as core from "@actions/core";
import { exec } from "@actions/exec";

export async function checkout(branch: string): Promise<void> {
  await exec(`git init`);
  await exec(`git config user.name "heads-up"`);
  await exec(`git config user.email "github@users.noreply.github.com"`);
  await exec(`git fetch`);
  await exec(`git checkout --progress --force ${branch}`);
}

export async function publish(commitMessage: string): Promise<void> {
  const publishConfig = {
    commitMessage,
    accessToken: core.getInput("access_token"),
    branch: "gh-pages",
    folder: "build",
    clean: true,
    name: "heads-up",
    email: "github@users.noreply.github.com",
    repositoryName: process.env.GITHUB_REPOSITORY,
    workspace: process.env.GITHUB_WORKSPACE || ""
  };

  return deploy(publishConfig)
}
