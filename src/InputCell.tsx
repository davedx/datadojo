import React, { useEffect, useRef, DOMElement } from 'react'
import { DataInfo, DataCondition } from './types'

interface Props {
  onChange?: (e: any) => void
  error?: string
  label: string
  value: string
  duration?: number
  readonly?: boolean
  info?: DataInfo
  id: string
}

const noop = () => {}

/*
  File \"/Users/dave/playground/api/../test/2950999/program.py\", line 8, in run\n
    words = input.flaMap(lambda line: line.split(\" \"))\n
AttributeError: 'RDD' object has no attribute 'flaMap'\n
*/

export const InputCell = (props: Props) => {
  const onChange = props.onChange || noop

  return <React.Fragment>
    <div className='label'>{props.label}</div>
    <div className='textarea-container'>
      <textarea
        id={props.id}
        style={{display: 'inline-block', width: 392, height: 500, margin: 0, padding: 3}}
        value={props.value}
        onChange={onChange}
        readOnly={props.readonly}
        ></textarea>
    </div>
    {props.error && <div style={{color: 'red'}}>Error: {props.error}</div>}
    {props.info && <div>type = {props.info.type}, length = {props.info.length}</div>}
  </React.Fragment>
}
