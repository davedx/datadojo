import { get, map, cloneDeep } from 'lodash-es'
import { DataInfo, DataCondition } from './types'

export const getInfo = (obj: any): DataInfo => {
  let type, length
  if (obj.constructor === Array) {
    type = 'array'
    length = obj.length
  } else if (obj instanceof Object) {
    type = 'object'
    length = Object.keys(obj).length
  } else {
    type = 'unknown'
    length = 0
  }
  return {type, length}
}

export const checkData = (data: object, conditions: DataCondition[]): DataCondition[] => {
  const checkedConditions = cloneDeep(conditions)

  map(data, (item: object) => {
    checkedConditions.map((condition: DataCondition) => {
      const val = get(item, condition.path)
      const rule = eval(`(a) => a ${condition.rule}`)
      if (!condition.passed) {
        condition.passed = 0
      }
      if (rule(val)) {
        condition.passed++
      }
    })
  })

  return checkedConditions
}

export const parseCsv = (input: string): string[][] => {
  const vals = input.split("\n")
  const numCommas = vals[0].split(',').length;
  const numSemicolons = vals[0].split(';').length;
  vals.splice(0, 1)
  const separator = numCommas > numSemicolons ? ',' : ';'
  return vals.map(line => line.split(separator))
}

export const parseData = (input: string): object => {
  let inputEval = {}
  const probableDataType = input[0] === '{' || input[0] === '[' ? 'json' : 'csv'
  switch (probableDataType) {
    case 'json':
      //console.log('parsing input: ', input)
      inputEval = JSON.parse(input)
      break
    case 'csv':
      inputEval = parseCsv(input)
      break
    default:
      throw new Error(`Cannot detect or parse input type. Supported: json, csv`)
  }
  return inputEval
}

export const downloadAsCsv = (e: any, output: string) => {
  if (output[0] !== '[') {
    e.preventDefault()
    return alert('Output data must be an array of arrays')
  }
  try {
    const vals = JSON.parse(output) as [][]
    const csvVals = vals[0].map((col: any, idx: number) => `H_${idx}`)
    vals.splice(0, 0, csvVals as [])
    const csv = vals
      .join("\n")
    e.target.href = "data:text/csv;base64," + btoa(csv)
  } catch (e) {
    alert('Failed to convert to CSV. Ensure data is an array of arrays')
  }
}

export const loadInputFromUrl = async(name: string, url: string, dispatch: Function) => {
  try {
    const file = await fetch(url)
    const json = await file.text()
    dispatch({
      type: 'change',
      name,
      input: 'input',
      value: json
    })
  } catch (e) {
    console.error(e)
  }
}
