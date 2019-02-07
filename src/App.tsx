import React, { useReducer } from 'react'
import './App.css'

import {sample1} from './sample1'

import {TransformDetails} from './TransformDetails'
import { AppAction, DataInfo } from './types'

interface StringMap {
  [index: string]: any
}

interface Transform {
  name: string
  order: number
  input: string
  transform: string
  output: string
}

interface State {
  transforms: Transform[]
}

const initialState = {
  transforms: [{
    name: 'MyTransform1',
    order: 0,
    input: `[
  1,
  2,
  3
]`,
    transform: '(a) => a.map(i => i * 2)',
    output: ''
  }, {
    name: 'MyTransform2',
    order: 1,
    input: '',
    transform: '(a) => a.map(i => i * 3)',
    output: ''
  }]
}

const defaultTransform = '(a) => a'

const change = (state: State, action: AppAction) => {
  const transform = state.transforms.find(t => t.name === action.name)
  if (transform) {
    if (action.input === 'input') {
      transform.input = action.value!
    } else if (action.input === 'transform') {
      transform.transform = action.value!
    }
  }
  return {...state}
}

const addTransform = (state: State, name: string) => {
  const idx = state.transforms.findIndex(t => t.name === name)
  const id = state.transforms.length+1
  state.transforms.splice(idx+1, 0, {
    name: `MyTransform${id}`,
    order: idx+2,
    input: '',
    transform: defaultTransform,
    output: ''
  });
  return {...state}
}

const removeTransform = (state: State, name: string) => {
  const idx = state.transforms.findIndex(t => t.name === name)
  state.transforms.splice(idx, 1)
  return {...state}
}

const reducer = (state: State, action: AppAction) => {
  switch (action.type) {
    case 'change':
      return change(state, action)
    case 'addTransform':
      return addTransform(state, action.name)
    case 'removeTransform':
      return removeTransform(state, action.name)
    default:
      throw new Error('invalid action')
  }
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

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  let nextInput = ''

  return (
    <div className='app'>
      <div style={{margin: 20, fontFamily: 'Chalkduster', fontSize: 35, color: 'white'}}>
        Data Dojo
      </div>
      {state.transforms.map((transform) => {
        const isChainedInput = nextInput != ''
        const inputString = nextInput ? nextInput : transform.input
        let error = '', inputInfo, outputInfo
        try {
          const inputEval = eval(inputString)
          inputInfo = getInfo(inputEval)
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
          transform={transform.transform}
          output={nextInput}
          outputInfo={outputInfo}
          isChainedInput={isChainedInput}
          dispatch={dispatch}
          error={error}
        />
      })}
    </div>
  )
}

export default App
