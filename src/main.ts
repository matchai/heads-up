import deploy, {init, actionInterface} from 'github-pages-deploy-action'
import got from 'got'
import * as core from '@actions/core'
import {exec} from '@actions/exec'
import {writeTimings} from './write'

export interface Timings {
  wait?: number
  dns?: number
  tcp?: number
  tls?: number
  request?: number
  firstByte?: number
  download?: number
  total?: number
}

async function main(): Promise<void> {
  const url: string = core.getInput('url')
  const response = await got(url)
  core.debug(`Request succesfully made: ${url}`)

  await exec(`git init`)
  await exec(`git config user.name "heads-up"`)
  await exec(`git config user.email "github@users.noreply.github.com"`)
  await exec(`git fetch`)
  await exec(`git checkout --progress --force gh-pages`)

  const timings: Timings = response.timings.phases
  await writeTimings(timings)
  core.debug(`Timings extracted`)

  const actionConfig = generateActionConfig(`✅ ${url} – ${timings.total}ms`)
  deploy(actionConfig)
}

function generateActionConfig(commitMessage?: string): actionInterface {
  return {
    commitMessage,
    accessToken: core.getInput('access_token'),
    branch: 'gh-pages',
    folder: 'build',
    clean: true,
    repositoryName: process.env.GITHUB_REPOSITORY,
    workspace: process.env.GITHUB_WORKSPACE || ''
  }
}

main().catch(e => core.setFailed(e.message))
