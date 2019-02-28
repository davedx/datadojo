import React, { useReducer, useEffect, useState } from 'react'
import { LanguageSelector } from './LanguageSelector'
import { Transform, AppState } from './types'
import { InputCell } from "./InputCell";

const baseUrl = window.location.port === '3000' ? 'http://localhost:3001/api' : '/api'

export const runSpark = async (transform: Transform, dispatch: Function, setRunning: Function) => {
  const id = Number(window.location.search.slice(4))
  console.log(`Running ${id}`)
//  const maybeCsv = maybeConvertToCsv(finalOutput)
  const body = {
    ...transform
  }
  try {
    const result = await fetch(`${baseUrl}/spark/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(body)
    })
    const json = await result.json()
    //console.log('got result: ', json)
    if (json.status !== 'OK') {
      dispatch({
        type: 'setAsyncErrorResult',
        name: transform.name,
        value: json.stderr
      })
      setRunning(false)
      return json
    } else {
      dispatch({
        type: 'setAsyncOutputResult',
        name: transform.name,
        value: json.output
      })
      setRunning(false)
      return json
    }
  } catch (e) {
    console.error(e)
    setRunning(false)
  }
}

interface Props {
  transform: Transform
  dispatch: Function
}

export const Spark = (props: Props) => {
  const [running, setRunning] = useState(false)

  const transform = props.transform
  return <div className='transform-details'>
    <div className='input-cell'>
      <InputCell
        id={`input-id_${transform.name}`}
        onChange={(e: any) => {
            props.dispatch({
              type: 'change',
              name: transform.name,
              input: 'input',
              value: e.target.value
            })
          }
        }
        label={'Input'}
        value={transform.input}
      />
    </div>
    <div className='input-cell'>
      <button
        className='btn run-spark-btn'
        disabled={running}
        onClick={e => {
        setRunning(true)
        runSpark(transform, props.dispatch, setRunning)
      }}>{running ? 'Running...' : 'Run program'}</button>
      <InputCell
        id={`transform-id_${transform.name}`}
        readonly={running}
        onChange={(e: any) => {
          props.dispatch({
            type: 'change',
            name: transform.name,
            input: 'transform',
            value: e.target.value
          })
        }}
        label={''}
        error={transform.error}
        value={transform.transform}
      />
      {transform.error && transform.error.split("\n").slice(1).map(
        (line, idx) => <div key={idx} style={{color: 'red'}}>{line}</div>
      )}
      <LanguageSelector
        name={transform.name}
        language={transform.language}
        dispatch={props.dispatch}
      />
    </div>
    <div className='input-cell'>
      <InputCell
        id={`output-id_${transform.name}`}
        label={'Output'}
        value={transform.output}
      />
    </div>
  </div>
}

// const doSync = async (state: AppState, output: string, dispatch: Function) => {
//   //const result = await debouncedSync(state, output)
//   //console.log('result: ', result)
//   // if (result && result.output) {
//   //   // TODO: key by name for multi-stage spark pipelines?
//   //   dispatch({
//   //     type: 'setAsyncOutputResult',
//   //     name: state.transforms[0].name,
//   //     value: result.output
//   //   })
//   // }
// }