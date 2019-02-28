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

  let structuredError
  if (props.error && props.error.indexOf("\n") !== -1) {
    const err = props.error.split("\n")
    if (err[0].indexOf(', line ') !== -1) {
      // structured error.
      const match = err[0].match(/ line (\d+)/)!
      
      structuredError = {
        line: parseInt(match[1], 10),
        error: err[1] + err[2]
      }
      
    }
  }

  const onChange = props.onChange || noop

  const errRef = useRef<HTMLInputElement>(null)

  // useEffect(() => {
  //   textareaEl.onScroll('scroll', () => {
  //     console.log('scroll!')
  //   })
  //   return () => {
  //     textareaEl.off('scroll')
  //   };
  // });
  const scroll = (e:any) => {
    console.log('scrolling,',e)
    if (errRef && errRef.current) {
      errRef.current.style.top = "5px"
    }
  }

  // text-decoration-line: underline; text-decoration-style: wavy; 
  return <React.Fragment>
    <div className='label'>{props.label}</div>
    <div className='textarea-container'>
      <textarea
        
        onScroll={scroll}
        id={props.id}
        style={{display: 'inline-block', width: 392, height: 500, margin: 0, padding: 3}}
        value={props.value}
        onChange={onChange}
        readOnly={props.readonly}
        ></textarea>
      <div
        ref={errRef}
        style={
        {position: 'absolute',
        top: structuredError ? structuredError.line*10 : 0,
        left: 10,
        textDecorationLine: 'underline',
        textDecorationStyle: 'wavy',
        color: 'red'
        }}>&nbsp;&nbsp;&nbsp;&nbsp;</div>
      {structuredError && <div style={{}}></div>}
    </div>
    {props.error && !structuredError && <div style={{color: 'red'}}>Error: {props.error}</div>}
    {props.info && <div>type = {props.info.type}, length = {props.info.length}</div>}
  </React.Fragment>
}
