import React from 'react'
import { AppAction, DataInfo, DataCondition, LanguageAction, Language } from './types'
import { InputCell } from './InputCell'
import { Conditions } from './Conditions'
import { LanguageSelector } from './LanguageSelector'

interface Props {
  name: string
  language: Language
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
    <div className='input-cell'>
      <InputCell
        readonly={props.isChainedInput}
        id={`input-id_${props.name}`}
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
    </div>
    <div className='input-cell'>
      <InputCell
        id={`transform-id_${props.name}`}
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
      <LanguageSelector
        name={props.name}
        language={props.language}
        dispatch={props.dispatch}
      />
    </div>
    <div className='input-cell'>
      <InputCell
        id={`output-id_${props.name}`}
        label={'Output'}
        value={props.output}
        info={props.outputInfo}
      />
    </div>
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
