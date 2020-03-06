import deploy from 'github-pages-deploy-action'
import got from 'got'
import * as core from '@actions/core'
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

  const timings: Timings = response.timings.phases
  await writeTimings(timings)
  core.debug(`Timings extracted`)

  deploy({
    commitMessage: `✅ ${url} – ${timings.total}ms`,
    accessToken: core.getInput('access_token'),
    branch: 'gh-pages',
    folder: 'build',
    repositoryName: process.env.GITHUB_REPOSITORY,
    workspace: process.env.GITHUB_WORKSPACE
  })
}

main().catch(e => core.setFailed(e.message))
