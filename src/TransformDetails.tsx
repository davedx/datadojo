import React from 'react'
import { AppAction, DataInfo, DataCondition } from './types'
import { InputCell } from './InputCell'
import { Conditions } from './Conditions'

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
  conditions: DataCondition[]
}

interface SaveCondition {
  id: number | undefined
  condition: DataCondition
}

export function TransformDetails(props: Props) {
  return <div className='transform-details'>
    <div className='condition'>
      {props.conditions && <Conditions
        onSaveCondition={({ id, condition }: SaveCondition) => {
          props.dispatch({
            type: 'saveCondition',
            name: props.name,
            id,
            condition
          })
        }}
        onRemoveCondition={(id: number) => {
          props.dispatch({
            type: 'removeCondition',
            name: props.name,
            id
          })
        }}
        name={props.name}
        conditions={props.conditions}
        dataLength={props.inputInfo ? props.inputInfo.length : 0}
        />}
    </div>
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
        className='transform-btn btn' onClick={() => props.dispatch({
        type: 'addTransform',
        name: props.name
      })}>+</button>
      <button
        disabled={!props.isChainedInput}
        className='transform-btn btn' onClick={() => props.dispatch({
        type: 'removeTransform',
        name: props.name
      })}>-</button>
    </div>
  </div>

}
