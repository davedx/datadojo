import { Language } from './types';

const extractFunctionName = (input: string) => {
  const match = input.match(/\$locals___main__\["([^"]+)"\] = \(function/)
  if (match) {
    return match[1]
  }
  throw new Error(`Cannot extract function name from compiled Python code`)
}

export const evaluate = (input: string, language: Language) => {
  switch (language) {
    case 'JavaScript':
      return eval(input)
    case 'Python':
      const py2js = window.__BRYTHON__.py2js(input, "__main__", "__main__")
      const ex = py2js.to_js()
      const functionName = extractFunctionName(ex)
      //console.log(ex)
      const ex_js=`(__input__) => { var _b_ = __BRYTHON__.builtins; var None; var $locals___main__ = {}
      ${ex};
      return $locals___main__["${functionName}"](__input__); }`
      //console.log(ex_js)
      return eval(ex_js)
    case 'PySpark':
      console.log(`Sending ${input} to spark`)
      return (x:any) => x//[]
  }
}
