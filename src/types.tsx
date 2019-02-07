export interface AppAction {
  type: string
  name: string
  input?: string
  value?: string
}

export interface DataInfo {
  type: string
  length: number
}