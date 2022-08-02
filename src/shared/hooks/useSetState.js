import { useReducer } from 'react'

const reducer = (state, newState) => ({ ...state, ...newState })

function useSetState(initState = {}){
  const [state, setState] = useReducer(reducer, initState)

  return [state, setState]
}

export default useSetState
