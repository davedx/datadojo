import { AppState, AppAction, LanguageAction } from './types'

const defaultTransform = '(a) => a'

const change = (state: AppState, action: AppAction) => {
  const transform = state.transforms.find(t => t.name === action.name)
  if (transform) {
    if (action.input === 'input') {
      transform.input = action.value!
    } else if (action.input === 'transform') {
      transform.transform = action.value!
    }
  }

  return {...state}
}

const addTransform = (state: AppState, name: string) => {
  const idx = state.transforms.findIndex(t => t.name === name)
  const id = state.transforms.length+1
  state.transforms.splice(idx+1, 0, {
    name: `MyTransform${id}`,
    language: 'JavaScript',
    order: idx+2,
    input: '',
    transform: defaultTransform,
    output: '',
    conditions: []
  });
  return {...state}
}

const removeTransform = (state: AppState, name: string) => {
  const idx = state.transforms.findIndex(t => t.name === name)
  state.transforms.splice(idx, 1)
  return {...state}
}

const saveCondition = (state: AppState, action: AppAction) => {
  const transform = state.transforms.find(t => t.name === action.name)
  if (transform) {
    if (action.id !== undefined) {
      transform.conditions[action.id] = action.condition!
    } else {
      transform.conditions.push(action.condition!)
    }
    console.log('conditions now: ', transform.conditions)
    return {...state}
  }
  return state
}

const removeCondition = (state: AppState, action: AppAction) => {
  const transform = state.transforms.find(t => t.name === action.name)
  if (transform) {
    if (action.id !== undefined) {
      transform.conditions.splice(action.id, 1)
      return {...state}
    }
  }
  return state
}

const setLanguage = (state: AppState, action: LanguageAction) => {
  const transform = state.transforms.find(t => t.name === action.name)
  if (transform) {
    transform.language = action.language
    return {...state}
  }
  return state
}

// upgrade persisted state on backend to latest version
const patchState = (state: AppState): AppState => {
  const patchedState = {
    ...state,
    transforms: state.transforms.map(t => {
      if (t.language === undefined) {
        t.language = 'JavaScript'
      }
      return t
    })
  }
  return patchedState
}

export const reducer = (state: AppState, action: AppAction) => {
  switch (action.type) {
    case 'loadState':
      return patchState(action.state as AppState)
    case 'change':
      return change(state, action)
    case 'addTransform':
      return addTransform(state, action.name)
    case 'removeTransform':
      return removeTransform(state, action.name)
    case 'saveCondition':
      return saveCondition(state, action)
    case 'removeCondition':
      return removeCondition(state, action)
    case 'setLanguage':
      return setLanguage(state, action as LanguageAction)
    default:
      throw new Error('invalid action')
  }
}
