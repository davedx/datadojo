import { AppState } from './types'

const baseUrl = window.location.port === '3000' ? 'http://localhost:3001/api' : '/api'

const maybeConvertToCsv = (output: string): string | undefined => {
  try {
    const vals = JSON.parse(output) as [][]
    const csvVals = vals[0].map((col: any, idx: number) => `H_${idx}`)
    vals.splice(0, 0, csvVals as [])
    const csv = vals
      .join("\n")
    return csv
  } catch (e) {
    return undefined
  }
}

export const sync = async(state: AppState, finalOutput: string) => {
  const id = Number(window.location.search.slice(4))
  console.log(`Syncing ${id}`)
  const maybeCsv = maybeConvertToCsv(finalOutput)
  const body = {
    outputJson: finalOutput,
    outputCsv: maybeCsv,
    ...state
  }
  try {
    const result = await fetch(`${baseUrl}/saved/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify(body)
    })
    const json = await result.json()
    return json
  } catch (e) {
    console.error(e)
  }
}

export const loadSaved = async(id: number, createdNew: boolean, dispatch: Function) => {
  if (!createdNew) {
    console.log(`Loading ${id}...`)
    try {
      const response = await fetch(`${baseUrl}/saved/${id}`)
      const json = await response.json()
      //console.log('loaded json: ', json)
      dispatch({
        type: 'loadState',
        state: json
      })
    } catch (e) {
      console.error(e)
    }
  }
}
