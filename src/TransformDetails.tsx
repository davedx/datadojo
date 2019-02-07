import React from 'react'
import { AppAction, DataInfo } from './types'
import { InputCell } from './InputCell'

interface Props {
  name: string
  input: string
  inputInfo: DataInfo | undefined
  transform: string
  output: string
  outputInfo: DataInfo | undefined
  error: string
  isChainedInput: boolean
  dispatch: React.Dispatch<AppAction>
}

export function TransformDetails(props: Props) {
  return <div className='transform-details'>
    <InputCell
      readonly={props.isChainedInput}
      onChange={(e: any) => {
        if (!props.isChainedInput) {
          props.dispatch({
            type: 'change',
            name: props.name,
            input: 'input',
            value: e.target.value
          })
        }
      }}
      label={'Input'}
      value={props.input}
      info={props.inputInfo}
    />
    <InputCell
      onChange={(e: any) => {
        props.dispatch({
          type: 'change',
          name: props.name,
          input: 'transform',
          value: e.target.value
        })
      }}
      label={props.name}
      error={props.error}
      value={props.transform}
      duration={1}
    />
    <InputCell
      label={'Output'}
      value={props.output}
      info={props.outputInfo}
    />
    <div className='transform-btns'>
      <button
        className='transform-btn' onClick={() => props.dispatch({
        type: 'addTransform',
        name: props.name
      })}>+</button>
      <button
        disabled={!props.isChainedInput}
        className='transform-btn' onClick={() => props.dispatch({
        type: 'removeTransform',
        name: props.name
      })}>-</button>
    </div>
  </div>

}
