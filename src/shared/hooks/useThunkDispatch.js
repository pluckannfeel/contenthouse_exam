import { useDispatch, useStore } from 'react-redux'

function useThunkDispatch(){
  return useDispatch(useStore().dispatch)
}

export default useThunkDispatch
