export interface AppAction {
  type: string
  name: string
  input?: string
  value?: string
  state?: object
  id?: number | undefined
  condition?: DataCondition
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
