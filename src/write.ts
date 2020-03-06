import * as core from '@actions/core'
import {promises as fs} from 'fs'
import * as path from 'path'
import {Timings} from './main'

export interface DataJson {
  lastUpdate: number
  entries: {
    name: string
    data: [number, number][]
  }[]
}

const DEFAULT_DATA_JSON = {
  lastUpdate: 0,
  entries: []
}

async function loadData(dataPath: string): Promise<DataJson> {
  try {
    const fileContents = await fs.readFile(dataPath, 'utf8')
    const parsed = JSON.parse(fileContents)
    core.debug(`Loaded JSON from ${dataPath}`)
    return parsed
  } catch (err) {
    core.debug(
      `Unable to load JSON from ${dataPath}. Using empty default: ${err}`
    )
    return DEFAULT_DATA_JSON
  }
}

function addTimingDataToJson(data: DataJson, timings: Timings): DataJson {
  const currentTime = Date.now()
  data.lastUpdate = currentTime
  Object.entries(timings)
    .filter(([key, value]) => value !== undefined)
    .map(([key, value]) => {
      const newEntry: [number, number] = [currentTime, value]
      const existingIndex = data.entries.findIndex(entry => entry.name === key)
      if (existingIndex > -1) {
        data.entries[existingIndex].data.push(newEntry)
      } else {
        data.entries.push({name: key, data: [newEntry]})
      }
    })
  return data
}

async function storeDataJson(dataPath: string, data: DataJson): Promise<void> {
  await fs.writeFile(dataPath, JSON.stringify(data), 'utf8')
  core.debug(`Wrote a new ${dataPath} file`)
}

export async function writeTimings(timings: Timings): Promise<void> {
  const buildPath = path.join(process.cwd(), 'build')
  const dataPath = path.join(buildPath, 'timings.json')
  await fs.mkdir(buildPath)

  const prevTimingData = await loadData(dataPath)
  const newTimingData = addTimingDataToJson(prevTimingData, timings)
  await storeDataJson(dataPath, newTimingData)
}
