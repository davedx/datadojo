import React from 'react'
import { DataInfo } from './types'

interface Props {
  onChange?: (e: any) => void
  error?: string
  label: string
  value: string
  duration?: number
  readonly?: boolean
  info?: DataInfo
}

const noop = () => {}

export function InputCell(props: Props) {
  const onChange = props.onChange || noop
  return <div className='input-cell'>
    <div className='label'>{props.label}</div>
    <textarea
      style={{width: 392, height: 500, margin: 0, padding: 3}}
      value={props.value}
      onChange={onChange}
      readOnly={props.readonly}
      ></textarea> 
    {props.error && <div style={{color: 'red'}}>Error: {props.error}</div>}
    {props.info && <div>type = {props.info.type}, length = {props.info.length}</div>}
    {props.duration && <div>duration = {props.duration} ms</div>}
  </div>
}
