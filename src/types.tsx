export interface StringMap {
  [index: string]: any
}

export interface AppAction {
  type: string
  name: string
  input?: string
  value?: string
  state?: object
  id?: number | undefined
  condition?: DataCondition
}

export type Language = 'JavaScript' | 'Python'

export interface LanguageAction extends AppAction {
  language: Language
}

export interface DataInfo {
  type: string
  length: number
}

export interface DataCondition {
  path: string
  rule: string
  passed?: number
}

export interface Transform {
  name: string
  language: Language
  order: number
  input: string
  transform: string
  output: string
  conditions: DataCondition[]
}

export interface AppState {
  transforms: Transform[]
}
