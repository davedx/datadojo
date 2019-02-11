import React, { useReducer, useEffect } from 'react'
import './App.css'
import { get, map, cloneDeep } from 'lodash-es'

import {sample1} from './sample1'

import {TransformDetails} from './TransformDetails'
import { AppAction, DataInfo, DataCondition } from './types'

const baseUrl = window.location.port === '3000' ? 'http://localhost:3001' : '/api'

interface StringMap {
  [index: string]: any
}

interface Transform {
  name: string
  order: number
  input: string
  transform: string
  output: string
  conditions: DataCondition[]
}

interface State {
  transforms: Transform[]
}

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
    input: ex2,
    transform: '(a) => a.map(i => i.age * 2)',
    output: '',
    conditions: [{
      path: 'age',
      rule: '> 0'
    }]
  }, {
    name: 'MyTransform2',
    order: 1,
    input: '',
    transform: '(a) => a.map(i => i * 3)',
    output: '',
    conditions: []
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

  sync(state)

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
    output: '',
    conditions: []
  });
  return {...state}
}

const removeTransform = (state: State, name: string) => {
  const idx = state.transforms.findIndex(t => t.name === name)
  state.transforms.splice(idx, 1)
  return {...state}
}

const saveCondition = (state: State, action: AppAction) => {
  const transform = state.transforms.find(t => t.name === action.name)
  if (transform) {
    if (action.id !== undefined) {
      transform.conditions[action.id] = action.condition!
    } else {
      transform.conditions.push(action.condition!)
    }
    console.log('conditions now: ', transform.conditions)
    return {...state}
  }
  return state
}

const removeCondition = (state: State, action: AppAction) => {
  const transform = state.transforms.find(t => t.name === action.name)
  if (transform) {
    if (action.id !== undefined) {
      transform.conditions.splice(action.id, 1)
      return {...state}
    }
  }
  return state
}

const reducer = (state: State, action: AppAction) => {
  switch (action.type) {
    case 'loadState':
      return {...action.state as State}
    case 'change':
      return change(state, action)
    case 'addTransform':
      return addTransform(state, action.name)
    case 'removeTransform':
      return removeTransform(state, action.name)
    case 'saveCondition':
      return saveCondition(state, action)
    case 'removeCondition':
      return removeCondition(state, action)
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

const checkData = (data: object, type: string, conditions: DataCondition[]): DataCondition[] => {
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

const loadSaved = async(id: number, createdNew: boolean, dispatch: Function) => {
  if (!createdNew) {
    console.log(`Loading ${id}...`)
    try {
      const response = await fetch(`${baseUrl}/saved/${id}`)
      const json = await response.json()
      //console.log('loaded json: ', json)
      dispatch({
        type: 'loadState',
        state: json
      })
    } catch (e) {
      console.error(e)
    }
  }
}

const sync = async(state: State) => {
  const id = Number(window.location.search.slice(4))
  console.log(`Syncing ${id}`)
  try {
    const result = await fetch(`${baseUrl}/saved/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(state)
    })
    const json = await result.json()
    return json
  } catch (e) {
    console.error(e)
  }
}

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState)

  let createdNew = false
  //console.log(window.location.search)
  if (window.location.search.length < 1) {
    window.location.search = '?id=' + Math.floor(Math.random()*10000000)
    createdNew = true
  }

  useEffect(() => {
    const id = Number(window.location.search.slice(4))
    console.log(`Loading ${id}`)
    loadSaved(id, createdNew, dispatch)
  }, [])

  let nextInput = ''
  return (
    <div className='app'>
      <div className='header'>
        Data Dojo
      </div>
      {state.transforms.map((transform: Transform) => {
        const isChainedInput = nextInput != ''
        const inputString = nextInput ? nextInput : transform.input
        let error = '', inputInfo, outputInfo
        let conditions = transform.conditions

        try {
          const inputEval = eval(inputString)
          inputInfo = getInfo(inputEval)

          conditions = checkData(inputEval, inputInfo.type, transform.conditions)
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
      <div className='footer'>
        Data Dojo is a <a href='http://redskyforge.com'>Red Sky Forge</a> project<br/><br/>
        Inspired by the work of John McCarthy and Alan Kay
      </div>
    </div>
  )
}

export default App
