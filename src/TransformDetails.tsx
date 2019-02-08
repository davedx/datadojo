import React, { useState } from 'react'
import { AppAction, DataInfo, DataCondition } from './types'
import { InputCell } from './InputCell'

interface ConditionsProps {
  dataLength: number
  name: string
  conditions: DataCondition[]
  onAddCondition: (e: any) => void
}

const Conditions = (props: ConditionsProps) => {
  const [state, setState] = useState({
    path: '',
    rule: ''
  } as DataCondition)
  const [visible, setVisible] = useState(false)

  const modalDisplay = visible ? 'block' : 'none'

  return <div>
    <button className='condition-add-btn btn' onClick={(e) => {
      setVisible(!visible)
    }}>+</button>
    {props.conditions.map((condition, idx) => {
      let state = 'unknown'
      if (condition.passed) {
        if (condition.passed === props.dataLength) {
          state = 'pass-all'
        } else if (condition.passed > 0) {
          state = 'pass-some'
        } else {
          state = 'pass-none'
        }
      }

      const colors = {
        unknown: '#EEE',
        'pass-all': 'green',
        'pass-some': 'orange',
        'pass-none': 'red'
      } as {[index: string]: string}

      return <div key={idx} title={`${state} (${condition.passed} / ${props.dataLength})`} style={{cursor: 'pointer', fontSize: 25, color: colors[state]}}>&#9679;</div>
    })}
    <div className='condition-modal' style={{display: modalDisplay}}>
      <h3>Add new condition for {props.name}</h3>
      <div>
        <label htmlFor={'path'}>Data path</label>
        <input
          id={'path'}
          value={state.path}
          placeholder={'age'}
          onChange={(e) => setState({
            ...state,
            path: e.target.value
          })} />
      </div>
      <div>
        <label htmlFor={'rule'}>Data rule</label>
        <input
          id={'rule'}
          value={state.rule}
          placeholder={' > 10'}
          onChange={(e) => setState({
            ...state,
            rule: e.target.value
          })} />
      </div>
      <div>
        <button
          className='btn'
          onClick={(e) => {
            props.onAddCondition(state)
            setVisible(false)
          }}>
          Add condition
        </button>
        <button
          className='btn'
          onClick={(e) => setVisible(false)}>
          Cancel
        </button>
      </div>
    </div>
  </div>
}

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

export function TransformDetails(props: Props) {
  return <div className='transform-details'>
    <div className='condition'>
      {props.conditions && <Conditions
        onAddCondition={(condition: DataCondition) => {
          props.dispatch({
            type: 'addCondition',
            name: props.name,
            condition
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
