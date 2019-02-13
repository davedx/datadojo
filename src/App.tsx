import React, { useReducer, useEffect } from 'react'
import './App.css'
import { get, map, cloneDeep, debounce } from 'lodash-es'

import * as _ from 'lodash-es'
//import * as csv from 'csvtojson'

import {sample1} from './sample1'

import { TransformDetails } from './TransformDetails'
import { Header } from './Header'
import { Transform, DataInfo, DataCondition } from './types'
import { reducer } from './appReducer'
import { loadSaved, sync } from './api'

const debouncedSync = debounce(sync, 250, { maxWait: 1000, trailing: true })

const ex3 = `a,b,c
1,2,3
4,5,6
7,8,9`

const ex2 = `[{
  name: "dave",
  age: 40
}, {
  name: "liam",
  age: 0
}]`

const ex1 = `[
  1,
  2,
  3
]`

const initialState = {
  transforms: [{
    name: 'MyTransform1',
    order: 0,
    input: ex3,
    transform: '(a) => a',//_.flatMap(a, i => i)',
    output: '',
    conditions: [{
      path: 'age',
      rule: '> 0'
    }]
  }, {
    name: 'MyTransform2',
    order: 1,
    input: '',
    transform: '(a) => a.map(i => i.map(j => parseInt(j, 10)))',//.map(i => i * 3)',
    output: '',
    conditions: []
  }]
}

const getInfo = (obj: any): DataInfo => {
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

const checkData = (data: object, conditions: DataCondition[]): DataCondition[] => {
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

declare global {
  interface Window {
    _: any
    csv: any
  }
}

const loadLibs = () => {
  window._ = _
}

const parseCsv = (input: string): string[][] => {
  const vals = input.split("\n")
  vals.splice(0, 1)
  return vals.map(line => line.split(","))
}

const parseData = (input: string): object => {
  let inputEval
  const probableDataType = input[0] === '{' || input[0] === '[' ? 'json' : 'csv'
  switch (probableDataType) {
    case 'json':
      inputEval = eval(input)
      break
    case 'csv':
      inputEval = parseCsv(input)
      break
    default:
      throw new Error(`Cannot detect or parse input type. Supported: json, csv`)
  }
  return inputEval
}

const downloadAsCsv = (e: any, output: string) => {
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

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  let createdNew = false

  if (window.location.search.length < 1) {
    window.location.search = '?id=' + Math.floor(Math.random()*10000000)
    createdNew = true
  }

  const id = Number(window.location.search.slice(4))

  useEffect(() => {
    console.log(`Loading ${id}`)
    loadSaved(id, createdNew, dispatch)
    loadLibs()
  }, [])

  let nextInput = ''
  let rendered = (
    <div className='app'>
      <Header />
      {state.transforms.map((transform: Transform) => {
        const isChainedInput = nextInput != ''
        const inputString = nextInput ? nextInput : transform.input
        let error = '', inputInfo, outputInfo
        let conditions = transform.conditions

        try {
          const inputEval = parseData(inputString)
          inputInfo = getInfo(inputEval)
          conditions = checkData(inputEval, transform.conditions)
          //console.log(inputEval)
          const transformEval = eval(transform.transform)
          const outputEval = transformEval(inputEval)
          outputInfo = getInfo(outputEval)
          nextInput = JSON.stringify(outputEval, null, 2)
          //console.log(nextInput)
        } catch (e) {
          nextInput = ''
          error = e.message
        }
        return <TransformDetails
          key={transform.name}
          name={transform.name}
          input={inputString}
          inputInfo={inputInfo}
          conditions={conditions}
          transform={transform.transform}
          output={nextInput}
          outputInfo={outputInfo}
          isChainedInput={isChainedInput}
          dispatch={dispatch}
          error={error}
        />
      })}
      <a
        className='btn download-csv-btn'
        download='download.csv'
        type='text/csv'
        onClick={e => downloadAsCsv(e, nextInput)}
      >
        Download final output as CSV
      </a>
      <a className='data-link' target='__blank' href={`/api/saved/${id}/csv`}>CSV URL</a>
      <a className='data-link' target='__blank' href={`/api/saved/${id}/json`}>JSON URL</a>
      <div className='footer'>
        Data Dojo is a <a href='https://twitter.com/redskyforge'>Red Sky Forge</a> project<br/><br/>
        Inspired by the work of John McCarthy and Alan Kay
      </div>
    </div>
  )
  //console.log('output: ', nextInput)
  debouncedSync(state, nextInput)
  return rendered
}

export default App
