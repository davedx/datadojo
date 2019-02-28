import React from 'react'
import { LanguageAction, Language } from './types'

interface Props {
  name: string
  language: Language
  dispatch: Function
}

export const LanguageSelector = (props: Props) =>
<select className='input-language'
  onChange={(e: any) => {
    const el = e.target
    const value = el.options[el.selectedIndex].value

    const action: LanguageAction = {
      type: 'setLanguage',
      name: props.name,
      language: value
    }
    
    props.dispatch(action)
  }}
  value={props.language}>
  <option value='JavaScript'>JavaScript</option>
  <option value='Python'>Python</option>
  <option value='PySpark'>PySpark</option>
</select>
