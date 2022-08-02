import { useEffect } from 'react'
import { useSelector } from 'react-redux'

import useSetState from '@hooks/useSetState'
import useThunkDispatch from '@hooks/useThunkDispatch'

import reduxModules from '@redux/modules'

const defaultState = {
  result: {},
}

function dispatchAction(action, requestOptions, options){
  const { dispatchAction: customDispatchAction } = options || {}

  if (customDispatchAction){
    return customDispatchAction(action, requestOptions)
  }

  return action(requestOptions)
}

function shouldPerform(action, entityReducer, hasDeps, options){
  const { shouldPerformFn } = options || {}
  const { errors, loading, loaded } = entityReducer

  if (shouldPerformFn){
    return shouldPerformFn(entityReducer)
  }

  return (action && !loading && (hasDeps || !loaded) && !errors.length)
}

/*
 * This hook can be used in the simple form:
 *
 * useReduxAction('providers', 'loadProviders', providerOptions, [])
 *
 * or you can pass custom functions for more advanced requests:
 *
 * useReduxAction('users', 'loadProviders', userOptions, [campaign.id], {
 *  dispatchAction: (action, requestOptions) => action('Campaign', campaign.id, requestOptions),
 *  shouldPerformFn: (entityReducer) => {
 *    const { loading, errors, loadedUsersForEntities } = entityReducer
 *    const entityKey = `Campaign${campaign.id}`
 *    return (campaign.id && !loading && !errors.length && !loadedUsersForEntities.includes(entityKey))
 *  },
 * })
 */

function useReduxAction(entityKey, actionName, requestOptions, deps = [], options = {}){
  const [state, setState] = useSetState(defaultState)
  const { result } = state

  const entityReducer = useSelector(s => s[entityKey]) || {}

  const dispatch = useThunkDispatch()

  useEffect(() => {
    const actions = reduxModules[entityKey]
    const action = actions ? actions[actionName] : null

    // We need to be able to force reload if required
    // If we have deps these will cause the useEffect function to run again
    // which means something we are watching has changed so we can reload.

    if (shouldPerform(action, entityReducer, !!deps.length, options)){
      dispatch(dispatchAction(action, requestOptions, options)).then(r => setState({ result: r }))
    }
  }, [dispatch, ...deps])

  // Order is important ;)
  return { ...entityReducer, ...result }
}

export default useReduxAction
