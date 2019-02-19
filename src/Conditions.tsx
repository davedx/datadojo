import React, { useState } from 'react'
import { DataCondition } from './types'

interface Props {
  dataLength: number
  name: string
  conditions: DataCondition[]
  onSaveCondition: (e: any) => void
  onRemoveCondition: (e: any) => void
}

export const Conditions = (props: Props) => {
  const [state, setState] = useState({
    path: '',
    rule: ''
  } as DataCondition)
  const [id, setId] = useState(undefined as number | undefined)
  const [visible, setVisible] = useState(false)

  const modalDisplay = visible ? 'block' : 'none'

  const title = id === undefined ? 'Add new' : 'Edit existing'

  return <div>
    <button className='condition-add-btn btn' onClick={(e) => {
      setId(undefined)
      setState({
        path: '',
        rule: ''
      })
      setVisible(true)
    }}>+</button>
    {props.conditions.map((condition, idx) => {
      let state = 'unknown'
      if (condition.passed !== undefined) {
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

      return (
        <button
          key={idx}
          onClick={(e) => {
            setId(idx)
            setState({
              path: condition.path,
              rule: condition.rule
            })
            setVisible(true)
          }}
          title={`${state} (${condition.passed} / ${props.dataLength})`}
          className='condition-btn'
          style={{color: colors[state]}}>
          &#9679;
        </button>)
    })}
    <div className='modal condition-modal' style={{display: modalDisplay}}>
      <h3>{title} condition for {props.name}</h3>
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
            props.onSaveCondition({
              id,
              condition: state
            })
            setVisible(false)
          }}>
          Save condition
        </button>
        {id !== undefined && <button
            className='btn'
            onClick={(e) => {
            props.onRemoveCondition({
              id
            })
            setVisible(false)
          }}>
          Remove condition
        </button>
        }
        <button
          className='btn'
          onClick={(e) => setVisible(false)}>
          Cancel
        </button>
      </div>
    </div>
  </div>
}
