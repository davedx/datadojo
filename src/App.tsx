import React, { useReducer, useEffect } from 'react'
import './App.css'
import { debounce } from 'lodash-es'

import * as _ from 'lodash-es'

import {sample1} from './sample1'

import { TransformDetails } from './TransformDetails'
import { Header } from './Header'
import { Transform, Language } from './types'
import { reducer } from './appReducer'
import { loadSaved, sync } from './api'
import { parseData, getInfo, checkData, loadInputFromUrl, downloadAsCsv } from './dataUtils';
import { evaluate } from './languages';

const debouncedSync = debounce(sync, 250, { maxWait: 1000, trailing: true })

const ex3 = `username,logins,money
dave@example.com,4,150
john@example.com,0,0
bart@example.com,12,2500,
jim@example.com,3,205
`

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
    language: 'Python' as Language,
    order: 0,
    input: ex3,
    transform: `def x(a):
    return a
`,
    //(a) => a',//_.flatMap(a, i => i)',
    output: '',
    conditions: [{
      path: 'age',
      rule: '> 0'
    }]
  }, {
    name: 'MyTransform2',
    language: 'JavaScript' as Language,
    order: 1,
    input: '',
    transform: '(a) => a.map(i => i.map(j => parseInt(j, 10)))',//.map(i => i * 3)',
    output: '',
    conditions: []
  }]
}

declare global {
  interface Window {
    _: any
    csv: any
    brython: any
    __BRYTHON__: any
  }
}

const loadLibs = () => {
  window._ = _
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

  useEffect(() => {
    // TODO: maybe this needs debouncing, what's indexOf behave like on huge strings?
    if (state.transforms.length > 0 &&
      state.transforms[0].input.indexOf('http') === 0) {
      loadInputFromUrl(state.transforms[0].name, state.transforms[0].input, dispatch)
    }
  })

  let nextInput = ''

  const rendered = (
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
          const transformEval = evaluate(transform.transform, transform.language)
          //console.log(transformEval)
          const outputEval = transformEval(inputEval)
          outputInfo = getInfo(outputEval)
          nextInput = JSON.stringify(outputEval, null, 2)
          //console.log(nextInput)
        } catch (e) {
          let message = e.message
          if (e.stack.indexOf('brython') !== -1) {
            message = `${e.message} (Brython compile error)`
          }
          console.error(e)

          nextInput = ''
          error = message
        }
        return <TransformDetails
          key={transform.name}
          name={transform.name}
          language={transform.language}
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

  debouncedSync(state, nextInput)

  return rendered
}

export default App
